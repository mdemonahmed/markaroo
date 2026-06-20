export type WidgetMode = 'comment' | 'view' | 'clean';
export type CaptureState = 'idle' | 'active';
export type CapturePhase = 'idle' | 'selecting' | 'composing';

export interface MarkarooCurrentUser {
	id: number;
	name: string;
	canManage: boolean;
	canCreate: boolean;
	canResolve: boolean;
	canAssign: boolean;
}

export interface MarkarooShareRights {
	canView: boolean;
	canComment: boolean;
}

export interface MarkarooConfig {
	restUrl: string;
	restNamespace: string;
	nonce: string;
	pluginUrl: string;
	currentUser: MarkarooCurrentUser;
	settings: Record< string, unknown >;
	widgetMode: WidgetMode;
	shareToken?: string;
	shareRights?: MarkarooShareRights;
	i18n: Record< string, string >;
}

declare global {
	interface Window {
		markarooConfig: MarkarooConfig;
	}
}

// -----------------------------------------------------------------------
// Capture data types
// -----------------------------------------------------------------------

export interface ElementOffset {
	xPct: number;
	yPct: number;
}

export interface CaptureRect {
	xPct: number;
	yPct: number;
	wPct: number;
	hPct: number;
}

export interface ScreenshotRect {
	type: 'point' | 'region';
	selector: string | null;
	elementOffset: ElementOffset | null;
	rect: CaptureRect | null;
	annotations: unknown[];
}

export interface CaptureData {
	x: number;          // page-level x percentage (0–1)
	y: number;          // page-level y percentage (0–1)
	viewport: string;   // e.g. "1440x900"
	screenshotRect: ScreenshotRect;
}

// -----------------------------------------------------------------------
// Widget state
// -----------------------------------------------------------------------

export interface WidgetState {
	mode: WidgetMode;
	captureState: CaptureState;  // derived: 'active' when capturePhase !== 'idle'
	capturePhase: CapturePhase;
	captureData: CaptureData | null;
	panelOpen: boolean;
	activePinId: number | null;
}

export type WidgetAction =
	| { type: 'SET_MODE'; mode: WidgetMode }
	| { type: 'START_CAPTURE' }
	| { type: 'PIN_PLACED'; data: CaptureData }
	| { type: 'END_CAPTURE' }
	| { type: 'OPEN_PANEL' }
	| { type: 'CLOSE_PANEL' }
	| { type: 'TOGGLE_PANEL' }
	| { type: 'SET_ACTIVE_PIN'; id: number | null };
