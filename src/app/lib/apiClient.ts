export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = RequestInit & {
  // ใส่เพิ่มได้ เช่น auth token ในอนาคต
};

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null) return undefined;
  if (!("message" in body)) return undefined;

  const message = (body as { message?: unknown }).message;
  return typeof message === "string" ? message : undefined;
}

export async function apiFetch<T>(url: string, options?: RequestOptions): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await parseJsonSafe(res);
    throw new ApiError(
      getErrorMessage(body) ?? `Request failed: ${res.status}`,
      res.status,
      body
    );
  }

  // บาง endpoint อาจไม่มี body
  const data = (await parseJsonSafe(res)) as T;
  return data;
}

export function apiGet<T>(url: string, options?: RequestOptions) {
  return apiFetch<T>(url, { ...options, method: "GET" });
}

export function apiPost<T>(url: string, body?: unknown, options?: RequestOptions) {
  return apiFetch<T>(url, {
    ...options,
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
