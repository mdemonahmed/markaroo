import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useWidgetDispatch } from '../store/WidgetContext';
import { RegionAnnotator } from './RegionAnnotator';
import type { CaptureData } from '../types';

// Unified capture: a click places a point pin, a drag selects a region.
export function CaptureOverlay() {
  const dispatch = useWidgetDispatch();

  useEffect( () => {
    window.dispatchEvent(
      new CustomEvent( 'markaroo:capture-start', { detail: { tool: 'region' } } )
    );
  }, [] );

  function cancel() {
    dispatch( { type: 'END_CAPTURE' } );
  }

  function handleCapture( data: CaptureData ) {
    dispatch( { type: 'PIN_PLACED', data } );
  }

  return (
    <>
      <RegionAnnotator onCapture={ handleCapture } onCancel={ cancel } />

      <div
        className="markaroo-capture-switch"
        role="toolbar"
        aria-label={ __( 'Capture mode', 'markaroo' ) }
      >
        <button className="markaroo-capture-switch__cancel" onClick={ cancel } type="button">
          { __( 'Cancel', 'markaroo' ) }
        </button>
      </div>
    </>
  );
}
