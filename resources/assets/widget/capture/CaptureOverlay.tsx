import { useState, useEffect } from '@wordpress/element';
import { useWidgetDispatch } from '../store/WidgetContext';
import { ClickCapture } from './ClickCapture';
import { RegionSelect } from './RegionSelect';
import type { CaptureData } from '../types';

type CaptureTool = 'click' | 'region';

export function CaptureOverlay() {
  const dispatch = useWidgetDispatch();
  const [ tool, setTool ] = useState< CaptureTool >( 'click' );

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
      { tool === 'click' ? (
        <ClickCapture onCapture={ handleCapture } />
      ) : (
        <RegionSelect onCapture={ handleCapture } />
      ) }

      <div className="markaroo-capture-toolbar" role="toolbar" aria-label="Capture tools">
        <span className="markaroo-capture-notice">
          { tool === 'click'
            ? 'Click anywhere to place a feedback pin'
            : 'Drag to select a region' }
        </span>

        <div className="markaroo-capture-tools">
          <button
            className={ `markaroo-capture-tool${
              tool === 'click' ? ' markaroo-capture-tool--active' : ''
            }` }
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

          <button
            className={ `markaroo-capture-tool${
              tool === 'region' ? ' markaroo-capture-tool--active' : ''
            }` }
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
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            Region
          </button>
        </div>

        <button className="markaroo-capture-cancel" onClick={ cancel } type="button">
          Cancel
        </button>
      </div>
    </>
  );
}
