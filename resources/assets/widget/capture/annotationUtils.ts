import type { Annotation } from '../types';

// -----------------------------------------------------------------------
// Primitive drawers (work in canvas-px space)
// -----------------------------------------------------------------------

function setStroke( ctx: CanvasRenderingContext2D, color: string, width: number ) {
	ctx.strokeStyle = color;
	ctx.fillStyle   = color;
	ctx.lineWidth   = width;
	ctx.lineCap     = 'round';
	ctx.lineJoin    = 'round';
}

function drawArrow(
	ctx: CanvasRenderingContext2D,
	fx: number, fy: number,
	tx: number, ty: number,
	color: string,
	width: number
) {
	setStroke( ctx, color, width );
	const angle   = Math.atan2( ty - fy, tx - fx );
	const headLen = Math.max( 12, width * 5 );

	ctx.beginPath();
	ctx.moveTo( fx, fy );
	ctx.lineTo( tx, ty );
	ctx.stroke();

	// Filled arrowhead.
	ctx.beginPath();
	ctx.moveTo( tx, ty );
	ctx.lineTo( tx - headLen * Math.cos( angle - Math.PI / 7 ), ty - headLen * Math.sin( angle - Math.PI / 7 ) );
	ctx.lineTo( tx - headLen * Math.cos( angle + Math.PI / 7 ), ty - headLen * Math.sin( angle + Math.PI / 7 ) );
	ctx.closePath();
	ctx.fill();
}

function drawRect(
	ctx: CanvasRenderingContext2D,
	fx: number, fy: number,
	tx: number, ty: number,
	color: string,
	width: number
) {
	setStroke( ctx, color, width );
	ctx.beginPath();
	ctx.strokeRect( fx, fy, tx - fx, ty - fy );
}

function drawCircle(
	ctx: CanvasRenderingContext2D,
	fx: number, fy: number,
	tx: number, ty: number,
	color: string,
	width: number
) {
	setStroke( ctx, color, width );
	const cx = ( fx + tx ) / 2;
	const cy = ( fy + ty ) / 2;
	const rx = Math.abs( tx - fx ) / 2;
	const ry = Math.abs( ty - fy ) / 2;
	ctx.beginPath();
	ctx.ellipse( cx, cy, Math.max( 1, rx ), Math.max( 1, ry ), 0, 0, Math.PI * 2 );
	ctx.stroke();
}

// -----------------------------------------------------------------------
// Render helpers
// -----------------------------------------------------------------------

/** Draw one annotation onto ctx. Converts percentage coords → canvas px. */
export function renderAnnotationItem(
	ctx: CanvasRenderingContext2D,
	ann: Annotation,
	canvasW: number,
	canvasH: number
) {
	const fx = ann.from.xPct * canvasW;
	const fy = ann.from.yPct * canvasH;
	const tx = ann.to.xPct * canvasW;
	const ty = ann.to.yPct * canvasH;

	switch ( ann.tool ) {
		case 'arrow':
			drawArrow( ctx, fx, fy, tx, ty, ann.color, ann.width );
			break;
		case 'rect':
			drawRect( ctx, fx, fy, tx, ty, ann.color, ann.width );
			break;
		case 'circle':
			drawCircle( ctx, fx, fy, tx, ty, ann.color, ann.width );
			break;
	}
}

/** Draw all annotations in order. */
export function renderAnnotations(
	ctx: CanvasRenderingContext2D,
	annotations: Annotation[],
	canvasW: number,
	canvasH: number
) {
	annotations.forEach( ( ann ) => renderAnnotationItem( ctx, ann, canvasW, canvasH ) );
}

// -----------------------------------------------------------------------
// Burn-in: draw annotations onto the screenshot blob
// -----------------------------------------------------------------------

async function loadImage( blob: Blob ): Promise< HTMLImageElement > {
	return new Promise( ( resolve, reject ) => {
		const img = new Image();
		const url = URL.createObjectURL( blob );
		img.onload  = () => { URL.revokeObjectURL( url ); resolve( img ); };
		img.onerror = () => { URL.revokeObjectURL( url ); reject( new Error( 'image load failed' ) ); };
		img.src = url;
	} );
}

/**
 * Composite annotations onto a screenshot blob and return a new blob.
 * Returns null if anything fails (burn-in failure must not block submission).
 */
export async function burnAnnotationsIntoBlob(
	sourceBlob: Blob,
	annotations: Annotation[],
	format: 'jpeg' | 'png' = 'jpeg',
	quality: number = 0.8
): Promise< Blob | null > {
	if ( annotations.length === 0 ) return sourceBlob;

	try {
		const img    = await loadImage( sourceBlob );
		const canvas = document.createElement( 'canvas' );
		canvas.width  = img.naturalWidth;
		canvas.height = img.naturalHeight;

		const ctx = canvas.getContext( '2d' );
		if ( ! ctx ) return sourceBlob;

		ctx.drawImage( img, 0, 0 );
		renderAnnotations( ctx, annotations, canvas.width, canvas.height );

		return new Promise< Blob | null >( ( resolve ) => {
			canvas.toBlob(
				resolve,
				format === 'png' ? 'image/png' : 'image/jpeg',
				format === 'jpeg' ? quality : undefined
			);
		} );
	} catch {
		return sourceBlob;
	}
}

// -----------------------------------------------------------------------
// Coordinate helpers
// -----------------------------------------------------------------------

/** Convert a pointer event position on a canvas element to percentage coords. */
export function canvasPct(
	clientX: number,
	clientY: number,
	canvas: HTMLCanvasElement
): { xPct: number; yPct: number } {
	const rect   = canvas.getBoundingClientRect();
	const scaleX = canvas.width  / rect.width;
	const scaleY = canvas.height / rect.height;
	return {
		xPct: Math.min( 1, Math.max( 0, ( ( clientX - rect.left ) * scaleX ) / canvas.width ) ),
		yPct: Math.min( 1, Math.max( 0, ( ( clientY - rect.top  ) * scaleY ) / canvas.height ) ),
	};
}
