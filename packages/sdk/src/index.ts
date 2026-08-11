/**
 * @letdraw/sdk — a small, dependency-free REST client for the LetDraw public
 * API (https://api.letdraw.com/api-v1). Node 18+ (uses the global `fetch`).
 *
 *   import { LetdrawClient } from '@letdraw/sdk';
 *   const ld = new LetdrawClient({ token: process.env.LETDRAW_TOKEN! });
 *   const { workspaces } = await ld.listWorkspaces();
 */

import type {
  Workspace, Folder, DocumentDetail, ListDocumentsParams, ListDocumentsResult,
  CreateDocumentBody, UpdateDocumentBody, FromCodeBody, GenerateBody, ShareResult,
  IconMatch, ShapeLibrary, ExportFormat, ApiErrorBody,
} from './types.js';

export * from './types.js';

export interface LetdrawClientOptions {
  /** Personal API token, e.g. "ld_live_…". Create one in Account → Developer. */
  token: string;
  /** Override the REST base URL. Default: https://api.letdraw.com/api-v1 */
  baseUrl?: string;
  /** Custom fetch (for tests / non-global environments). */
  fetch?: typeof fetch;
}

export class LetdrawApiError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'LetdrawApiError';
    this.status = status;
    this.code = code;
  }
}

export class LetdrawClient {
  private readonly token: string;
  private readonly base: string;
  private readonly f: typeof fetch;

  constructor(opts: LetdrawClientOptions) {
    if (!opts?.token) throw new Error('LetdrawClient: `token` is required.');
    this.token = opts.token;
    this.base = (opts.baseUrl ?? 'https://api.letdraw.com/api-v1').replace(/\/+$/, '');
    const f = opts.fetch ?? (globalThis.fetch as typeof fetch | undefined);
    if (!f) throw new Error('LetdrawClient: no fetch available (Node 18+ or pass opts.fetch).');
    this.f = f;
  }

  private async req<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await this.f(this.base + path, {
      method,
      headers: {
        authorization: `Bearer ${this.token}`,
        ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : undefined;
    if (!res.ok) {
      const e = (data as ApiErrorBody | undefined)?.error;
      throw new LetdrawApiError(res.status, e?.code ?? 'error', e?.message ?? res.statusText);
    }
    return data as T;
  }

  private qs(params: Record<string, string | number | undefined>): string {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v !== undefined) p.set(k, String(v));
    const s = p.toString();
    return s ? `?${s}` : '';
  }

  // ── Workspaces / folders ────────────────────────────────────────────────
  listWorkspaces(): Promise<{ workspaces: Workspace[] }> {
    return this.req('GET', '/workspaces');
  }
  listFolders(workspaceId: string): Promise<{ folders: Folder[] }> {
    return this.req('GET', `/folders${this.qs({ workspace: workspaceId })}`);
  }

  // ── Documents ───────────────────────────────────────────────────────────
  listDocuments(params: ListDocumentsParams = {}): Promise<ListDocumentsResult> {
    return this.req('GET', `/documents${this.qs({
      workspace: params.workspaceId, folder: params.folderId, limit: params.limit, cursor: params.cursor,
    })}`);
  }
  createDocument(body: CreateDocumentBody): Promise<{ document: DocumentDetail }> {
    return this.req('POST', '/documents', body);
  }
  getDocument(id: string): Promise<{ document: DocumentDetail }> {
    return this.req('GET', `/documents/${encodeURIComponent(id)}`);
  }
  updateDocument(id: string, body: UpdateDocumentBody): Promise<{ document: DocumentDetail }> {
    return this.req('PATCH', `/documents/${encodeURIComponent(id)}`, body);
  }
  deleteDocument(id: string): Promise<{ ok: true }> {
    return this.req('DELETE', `/documents/${encodeURIComponent(id)}`);
  }

  // ── Build / generate / export ───────────────────────────────────────────
  fromCode(body: FromCodeBody): Promise<{ document: DocumentDetail }> {
    return this.req('POST', '/documents/from-code', body);
  }
  generate(body: GenerateBody): Promise<{ document: DocumentDetail }> {
    return this.req('POST', '/documents/generate', body);
  }
  exportCode(id: string, format: ExportFormat = 'mermaid'): Promise<{ format: ExportFormat; code: string }> {
    return this.req('GET', `/documents/${encodeURIComponent(id)}/export${this.qs({ format })}`);
  }

  // ── Sharing ─────────────────────────────────────────────────────────────
  share(id: string, opts: { expiresAt?: string } = {}): Promise<ShareResult> {
    return this.req('POST', `/documents/${encodeURIComponent(id)}/share`, { expiresAt: opts.expiresAt ?? null });
  }
  unshare(id: string): Promise<{ ok: true }> {
    return this.req('DELETE', `/documents/${encodeURIComponent(id)}/share`);
  }

  // ── Icons / libraries / capabilities ────────────────────────────────────
  listLibraries(withItems = false): Promise<{ libraries: ShapeLibrary[] }> {
    return this.req('GET', `/libraries${this.qs({ items: withItems ? 1 : undefined })}`);
  }
  searchIcons(query: string, opts: { library?: string; limit?: number } = {}): Promise<{ matches: IconMatch[] }> {
    return this.req('GET', `/icons${this.qs({ query, library: opts.library, limit: opts.limit })}`);
  }
  /** The "how to draw well" guide (markdown), for feeding your own model. */
  capabilities(): Promise<unknown> {
    return this.req('GET', '/capabilities');
  }
}
