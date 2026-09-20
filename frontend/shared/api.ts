export class ApiError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, { signal });
  if (!response.ok) throw new ApiError(response.status);
  return response.json() as Promise<T>;
}

export async function sendJson<T>(
  path: string,
  method: "POST" | "PUT",
  body: unknown,
  csrfToken: string,
): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: { "content-type": "application/json", "x-steeple-csrf": csrfToken },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as { error?: unknown } | null;
    const error = new ApiError(response.status);
    if (typeof result?.error === "string") error.message = result.error;
    throw error;
  }
  return response.json() as Promise<T>;
}
