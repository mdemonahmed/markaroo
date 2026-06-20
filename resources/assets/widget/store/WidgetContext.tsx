import { createContext, useContext, useReducer, ReactNode } from '@wordpress/element';
import type {
	Annotation,
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
	screenshotBlob: null,
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
				screenshotBlob: null,
				panelOpen: false,
			};

		case 'PIN_PLACED':
			// Move to 'annotating' — WidgetRoot triggers screenshot capture.
			return {
				...state,
				capturePhase: 'annotating',
				captureData: action.data,
				screenshotBlob: null,
			};

		case 'SCREENSHOT_TAKEN':
			return { ...state, screenshotBlob: action.blob };

		case 'ANNOTATIONS_DONE': {
			// Merge annotations into captureData.screenshotRect and advance to composing.
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

const WidgetStateContext    = createContext< WidgetState >( initialState );
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
