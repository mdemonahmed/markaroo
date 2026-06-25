/**
 * Thin REST client. Reads nonce + share token from markarooConfig.
 * Always rejects with an Error whose message is the WP error message.
 */

function cfg() {
  return window.markarooConfig;
}

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const config = cfg();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-WP-Nonce': config.nonce,
    ...extra,
  };
  if (config.shareToken) {
    headers['X-Markaroo-Share'] = config.shareToken;
  }
  return headers;
}

function apiUrl(path: string): string {
  return `${cfg().restUrl}markaroo/v1/${path}`;
}

export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: authHeaders(init.headers as Record<string, string>),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    throw new Error((body.message as string) || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/**
 * POST with a JSON body.
 * @param path
 * @param data
 */
export function apiPost<T = unknown>(path: string, data: unknown): Promise<T> {
  return apiFetch<T>(path, { method: 'POST', body: JSON.stringify(data) });
}

/**
 * PATCH with a JSON body.
 * @param path
 * @param data
 */
export function apiPatch<T = unknown>(path: string, data: unknown): Promise<T> {
  return apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(data) });
}

/**
 * DELETE.
 * @param path
 */
export function apiDelete<T = unknown>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: 'DELETE' });
}
