const DEFAULT_BASE_URL = '/api';

async function handleResponse<T>(response: Response, path: string): Promise<T> {
  if (!response.ok) {
    throw new Error(`Error al consultar ${path}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${DEFAULT_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  return handleResponse<T>(response, path);
}

export async function postJSON<TBody, TResponse>(path: string, body: TBody, init?: RequestInit) {
  const response = await fetch(`${DEFAULT_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    ...init,
  });

  return handleResponse<TResponse>(response, path);
}
