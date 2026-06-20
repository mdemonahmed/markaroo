export type WidgetMode = 'comment' | 'view' | 'clean';
export type CaptureState = 'idle' | 'active';

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
	settings: Record<string, unknown>;
	widgetMode: WidgetMode;
	shareToken?: string;
	shareRights?: MarkarooShareRights;
	i18n: Record<string, string>;
}

declare global {
	interface Window {
		markarooConfig: MarkarooConfig;
	}
}

export interface WidgetState {
	mode: WidgetMode;
	captureState: CaptureState;
	panelOpen: boolean;
	activePinId: number | null;
}

export type WidgetAction =
	| { type: 'SET_MODE'; mode: WidgetMode }
	| { type: 'START_CAPTURE' }
	| { type: 'END_CAPTURE' }
	| { type: 'OPEN_PANEL' }
	| { type: 'CLOSE_PANEL' }
	| { type: 'TOGGLE_PANEL' }
	| { type: 'SET_ACTIVE_PIN'; id: number | null };
