import { createContext, useContext, useReducer, ReactNode } from '@wordpress/element';
import type { WidgetAction, WidgetMode, WidgetState } from '../types';

const initialState: WidgetState = {
  mode: 'comment',
  captureState: 'idle',
  capturePhase: 'idle',
  captureData: null,
  panelOpen: false,
  activePinId: null,
  feedbacks: [],
};

function widgetReducer( state: WidgetState, action: WidgetAction ): WidgetState {
  switch ( action.type ) {
    case 'SET_MODE':
      return { ...state, mode: action.mode };

    case 'START_CAPTURE':
      return {
        ...state,
        captureState: 'active',
        capturePhase: 'selecting',
        captureData: null,
        panelOpen: false,
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

    case 'END_CAPTURE':
      return {
        ...state,
        captureState: 'idle',
        capturePhase: 'idle',
        captureData: null,
      };

    case 'FEEDBACK_SUBMITTED':
      return {
        ...state,
        captureState: 'idle',
        capturePhase: 'idle',
        captureData: null,
        activePinId: action.item.id,
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
