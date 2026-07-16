/**
 * The launcher's first click dispatches ENABLE_SESSION then START_CAPTURE so
 * the user can place a pin immediately; Cancel (END_CAPTURE) must return to
 * an enabled session.
 */
import { widgetReducer } from '../store/WidgetContext';
import type { WidgetState } from '../types';

describe( 'instant pinning state sequence', () => {
  const base: WidgetState = {
    mode: 'comment',
    enabled: false,
    captureState: 'idle',
    capturePhase: 'idle',
    captureData: null,
    panelOpen: false,
    activePinId: null,
    feedbacks: [],
  };

  it( 'ENABLE_SESSION then START_CAPTURE puts the widget straight into pin placement', () => {
    const afterEnable = widgetReducer( base, { type: 'ENABLE_SESSION' } );
    expect( afterEnable.enabled ).toBe( true );
    expect( afterEnable.panelOpen ).toBe( true );

    const capturing = widgetReducer( afterEnable, { type: 'START_CAPTURE' } );
    expect( capturing.enabled ).toBe( true );
    expect( capturing.captureState ).toBe( 'active' );
    expect( capturing.capturePhase ).toBe( 'selecting' );
  } );

  it( 'END_CAPTURE returns to an enabled session', () => {
    const capturing = widgetReducer( widgetReducer( base, { type: 'ENABLE_SESSION' } ), {
      type: 'START_CAPTURE',
    } );
    const cancelled = widgetReducer( capturing, { type: 'END_CAPTURE' } );
    expect( cancelled.enabled ).toBe( true );
    expect( cancelled.captureState ).toBe( 'idle' );
    expect( cancelled.capturePhase ).toBe( 'idle' );
  } );
} );
