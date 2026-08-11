/**
 * Public shape of the LetDraw REST API. This is the documented subset the API
 * accepts and returns; it is intentionally looser than the app's internal model.
 * Author scenes with LetDraw-native elements (below). The API also auto-detects
 * and converts a compatible open whiteboard JSON format, so scenes exported from
 * other tools import cleanly.
 */

export type ExportFormat = 'mermaid' | 'd2';

/** A source format accepted by `fromCode` (auto-detected). */
export type CodeFormat =
  | 'compose'
  | 'kubernetes'
  | 'dot'
  | 'plantuml'
  | 'terraform'
  | 'helm'
  | 'sql';

export interface Workspace {
  id: string;
  name: string;
  role: string;
}

export interface Folder {
  id: string;
  name: string;
  workspaceId: string;
}

export interface DocumentSummary {
  id: string;
  name: string;
  folderId?: string | null;
  workspaceId?: string | null;
  updatedAt?: string;
}

export interface Scene {
  /** LetDraw-native elements, or a compatible open whiteboard JSON format (auto-detected). */
  elements: unknown[];
  [k: string]: unknown;
}

export interface DocumentDetail extends DocumentSummary {
  scene?: Scene;
}

export interface ListDocumentsParams {
  workspaceId?: string;
  folderId?: string;
  limit?: number;
  cursor?: string;
}

export interface ListDocumentsResult {
  documents: DocumentSummary[];
  nextCursor?: string | null;
}

export interface CreateDocumentBody {
  name?: string;
  workspaceId?: string;
  folderId?: string;
  scene?: Scene;
}

export interface UpdateDocumentBody {
  name?: string;
  scene?: Scene;
}

export interface FromCodeBody {
  code: string;
  name?: string;
  workspaceId?: string;
  folderId?: string;
}

export interface GenerateBody {
  prompt: string;
  name?: string;
  workspaceId?: string;
  folderId?: string;
}

export interface ShareResult {
  url: string;
  expiresAt?: string | null;
}

export interface IconMatch {
  library: string;
  label: string;
  /** Set this string as an element's `iconRef` to stamp the icon. */
  ref: string;
}

export interface ShapeLibrary {
  id: string;
  count: number;
}

/** Error body returned by the API: `{ error: { code, message } }`. */
export interface ApiErrorBody {
  error: { code: string; message: string };
}
