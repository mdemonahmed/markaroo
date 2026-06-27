import { useState, useEffect } from '@wordpress/element';
import { useWidgetDispatch } from '../store/WidgetContext';
import { ClickCapture } from './ClickCapture';
import { RegionAnnotator } from './RegionAnnotator';
import type { CaptureData } from '../types';

type CaptureTool = 'region' | 'click';

export function CaptureOverlay() {
  const dispatch = useWidgetDispatch();
  const [ tool, setTool ] = useState< CaptureTool >( 'region' );

  useEffect( () => {
    window.dispatchEvent( new CustomEvent( 'markaroo:capture-start', { detail: { tool } } ) );
  }, [] ); // eslint-disable-line react-hooks/exhaustive-deps

  function cancel() {
    dispatch( { type: 'END_CAPTURE' } );
  }

  function handleCapture( data: CaptureData ) {
    dispatch( { type: 'PIN_PLACED', data } );
  }

  return (
    <>
      { tool === 'region' ? (
        <RegionAnnotator onCapture={ handleCapture } onCancel={ cancel } />
      ) : (
        <ClickCapture onCapture={ handleCapture } />
      ) }

      <div className="markaroo-capture-switch" role="toolbar" aria-label="Capture mode">
        <button
          className={ `markaroo-capture-switch__btn${ tool === 'region' ? ' is-active' : '' }` }
          onClick={ () => setTool( 'region' ) }
          type="button"
          aria-pressed={ tool === 'region' }
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 3" />
          </svg>
          Area
        </button>
        <button
          className={ `markaroo-capture-switch__btn${ tool === 'click' ? ' is-active' : '' }` }
          onClick={ () => setTool( 'click' ) }
          type="button"
          aria-pressed={ tool === 'click' }
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
          </svg>
          Pin
        </button>
        <button className="markaroo-capture-switch__cancel" onClick={ cancel } type="button">
          Cancel
        </button>
      </div>
    </>
  );
}
