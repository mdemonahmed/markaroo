import { createContext, useContext, useReducer, ReactNode } from '@wordpress/element';
import type { Annotation, FeedbackItem, WidgetAction, WidgetMode, WidgetState } from '../types';

const initialState: WidgetState = {
  mode: 'comment',
  captureState: 'idle',
  capturePhase: 'idle',
  captureData: null,
  screenshotBlob: null,
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
        screenshotBlob: null,
        panelOpen: false,
      };

    case 'PIN_PLACED':
      return {
        ...state,
        capturePhase: 'annotating',
        captureData: action.data,
        screenshotBlob: null,
      };

    case 'SCREENSHOT_TAKEN':
      return { ...state, screenshotBlob: action.blob };

    case 'ANNOTATIONS_DONE': {
      const prevData = state.captureData;
      const nextData = prevData
        ? {
            ...prevData,
            screenshotRect: {
              ...prevData.screenshotRect,
              annotations: action.annotations,
            },
          }
        : null;
      return {
        ...state,
        capturePhase: 'composing',
        captureData: nextData,
        screenshotBlob: action.burnedBlob ?? state.screenshotBlob,
      };
    }

    case 'END_CAPTURE':
      return {
        ...state,
        captureState: 'idle',
        capturePhase: 'idle',
        captureData: null,
        screenshotBlob: null,
      };

    case 'FEEDBACK_SUBMITTED':
      return {
        ...state,
        captureState: 'idle',
        capturePhase: 'idle',
        captureData: null,
        screenshotBlob: null,
        panelOpen: true,
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
