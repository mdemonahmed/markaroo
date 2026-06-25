export type WidgetMode = 'comment' | 'view' | 'clean';
export type CaptureState = 'idle' | 'active';
export type CapturePhase = 'idle' | 'selecting' | 'annotating' | 'composing';

export interface MarkarooCurrentUser {
  id: number;
  name: string;
  canManage: boolean;
  canCreate: boolean;
  canResolve: boolean;
  canAssign: boolean;
  canApprove: boolean;
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
  statusList?: Array<{ value: string; label: string }>;
  statusColors?: Record<string, string>;
}

declare global {
  interface Window {
    markarooConfig: MarkarooConfig;
  }
}

// -----------------------------------------------------------------------
// Capture data types
// -----------------------------------------------------------------------

export interface ElementOffset {
  xPct: number;
  yPct: number;
}

export interface CaptureRect {
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
}

export interface Annotation {
  tool: 'arrow' | 'rect' | 'circle';
  from: { xPct: number; yPct: number };
  to: { xPct: number; yPct: number };
  color: string;
  width: number;
}

export interface ScreenshotRect {
  type: 'point' | 'region';
  selector: string | null;
  elementOffset: ElementOffset | null;
  rect: CaptureRect | null;
  annotations: Annotation[];
}

export interface CaptureData {
  x: number; // page-level x percentage (0–1)
  y: number; // page-level y percentage (0–1)
  viewport: string; // e.g. "1440x900"
  screenshotRect: ScreenshotRect;
}

// -----------------------------------------------------------------------
// Widget state
// -----------------------------------------------------------------------

export interface WidgetState {
  mode: WidgetMode;
  captureState: CaptureState; // derived: 'active' when capturePhase !== 'idle'
  capturePhase: CapturePhase;
  captureData: CaptureData | null;
  screenshotBlob: Blob | null;
  panelOpen: boolean;
  activePinId: number | null;
  feedbacks: FeedbackItem[];
}

export type WidgetAction =
  | { type: 'SET_MODE'; mode: WidgetMode }
  | { type: 'START_CAPTURE' }
  | { type: 'PIN_PLACED'; data: CaptureData }
  | { type: 'SCREENSHOT_TAKEN'; blob: Blob | null }
  | { type: 'ANNOTATIONS_DONE'; annotations: Annotation[]; burnedBlob: Blob | null }
  | { type: 'END_CAPTURE' }
  | { type: 'OPEN_PANEL' }
  | { type: 'CLOSE_PANEL' }
  | { type: 'TOGGLE_PANEL' }
  | { type: 'SET_ACTIVE_PIN'; id: number | null }
  | { type: 'FEEDBACK_SUBMITTED'; item: FeedbackItem }
  | { type: 'FEEDBACKS_LOADED'; items: FeedbackItem[] }
  | { type: 'FEEDBACK_UPDATED'; item: FeedbackItem }
  | { type: 'FEEDBACK_DELETED'; id: number };

// -----------------------------------------------------------------------
// API types (mirrors server format_item output)
// -----------------------------------------------------------------------

export interface FeedbackItem {
  id: number;
  page_key: string;
  page_url: string;
  comment: string;
  status: 'open' | 'in_progress' | 'resolved' | 'approved' | 'reopened';
  status_label?: string;
  locked?: boolean;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  assigned_to_id: number;
  assigned_to_name: string;
  x: number;
  y: number;
  viewport: string;
  screenshot_rect: ScreenshotRect | null;
  screenshot_id: number;
  screenshot_path: string;
  screenshot_url?: string;
  attachments: AttachmentMeta[];
  tags: string[];
  author: string;
  author_id: number;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  replies?: ReplyItem[];
}

export interface ReplyItem {
  id: number;
  feedback_id: number;
  reply_uuid: string;
  comment: string;
  author: string;
  author_id: number;
  created_at: string;
}

export interface AttachmentMeta {
  id: number;
  url: string;
  filename: string;
  mime: string;
  size: number;
  type_badge: string;
}
