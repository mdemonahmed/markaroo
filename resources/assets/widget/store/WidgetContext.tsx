import { createContext, useContext, useReducer, ReactNode } from '@wordpress/element';
import type { WidgetAction, WidgetMode, WidgetState } from '../types';

const initialState: WidgetState = {
  mode: 'comment',
  enabled: false,
  captureState: 'idle',
  capturePhase: 'idle',
  captureData: null,
  panelOpen: false,
  activePinId: null,
  statusFilter: 'open',
  feedbacks: [],
};

export function widgetReducer( state: WidgetState, action: WidgetAction ): WidgetState {
  switch ( action.type ) {
    case 'SET_MODE':
      return { ...state, mode: action.mode };

    // Enter feedback mode: reveal pins and auto-open the list panel.
    case 'ENABLE_SESSION':
      return { ...state, enabled: true, panelOpen: true };

    // Exit feedback mode: hide pins/panel/cards and abort any capture.
    case 'DISABLE_SESSION':
      return {
        ...state,
        enabled: false,
        panelOpen: false,
        activePinId: null,
        captureState: 'idle',
        capturePhase: 'idle',
        captureData: null,
      };

    // Panel stays open during capture — the user can browse pins while placing.
    case 'START_CAPTURE':
      return {
        ...state,
        captureState: 'active',
        capturePhase: 'selecting',
        captureData: null,
        activePinId: null,
      };

    // Region/click confirmed (annotations already merged into screenshotRect).
    // Goes straight to composing — annotation happens live during 'selecting'.
    case 'PIN_PLACED':
      return {
        ...state,
        capturePhase: 'composing',
        captureData: action.data,
      };

    // Cancelled capture: return to the list panel (it auto-hid on START_CAPTURE).
    case 'END_CAPTURE':
      return {
        ...state,
        captureState: 'idle',
        capturePhase: 'idle',
        captureData: null,
        panelOpen: state.enabled,
      };

    // New feedback is always open — snap the filter back so the new pin is visible.
    case 'FEEDBACK_SUBMITTED':
      return {
        ...state,
        captureState: 'idle',
        capturePhase: 'idle',
        captureData: null,
        activePinId: action.item.id,
        statusFilter: 'open',
        feedbacks: [ action.item, ...state.feedbacks ],
      };

    case 'FEEDBACKS_LOADED':
      return { ...state, feedbacks: action.items };

    case 'FEEDBACK_UPDATED':
      return {
        ...state,
        feedbacks: state.feedbacks.map( ( f ) => ( f.id === action.item.id ? action.item : f ) ),
      };

    case 'FEEDBACK_DELETED':
      return {
        ...state,
        feedbacks: state.feedbacks.filter( ( f ) => f.id !== action.id ),
        activePinId: state.activePinId === action.id ? null : state.activePinId,
      };

    case 'OPEN_PANEL':
      return { ...state, panelOpen: true };

    case 'CLOSE_PANEL':
      return { ...state, panelOpen: false };

    case 'TOGGLE_PANEL':
      return { ...state, panelOpen: ! state.panelOpen };

    case 'SET_ACTIVE_PIN':
      return { ...state, activePinId: action.id };

    // Panel tab; the pin layer filters on-page markers by the same value.
    case 'SET_STATUS_FILTER':
      return { ...state, statusFilter: action.filter, activePinId: null };

    default:
      return state;
  }
}

const WidgetStateContext = createContext< WidgetState >( initialState );
const WidgetDispatchContext = createContext< React.Dispatch< WidgetAction > >( () => {} );

interface WidgetProviderProps {
  children: ReactNode;
  initialMode?: WidgetMode;
}

export function WidgetProvider( { children, initialMode = 'comment' }: WidgetProviderProps ) {
  const [ state, dispatch ] = useReducer( widgetReducer, {
    ...initialState,
    mode: initialMode,
  } );

  return (
    <WidgetStateContext.Provider value={ state }>
      <WidgetDispatchContext.Provider value={ dispatch }>
        { children }
      </WidgetDispatchContext.Provider>
    </WidgetStateContext.Provider>
  );
}

export function useWidget(): WidgetState {
  return useContext( WidgetStateContext );
}

export function useWidgetDispatch(): React.Dispatch< WidgetAction > {
  return useContext( WidgetDispatchContext );
}
