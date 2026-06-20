import { createContext, useContext, useReducer, ReactNode } from '@wordpress/element';
import type {
	CaptureData,
	CapturePhase,
	WidgetAction,
	WidgetMode,
	WidgetState,
} from '../types';

const initialState: WidgetState = {
	mode: 'comment',
	captureState: 'idle',
	capturePhase: 'idle',
	captureData: null,
	panelOpen: false,
	activePinId: null,
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
			};

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
