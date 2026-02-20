export type ApiRequestInit = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  cache?: RequestCache;
  signal?: AbortSignal;
};

export async function apiRequest<T>(
  endpoint: string,
  init: ApiRequestInit = {},
): Promise<T> {
  const { body, headers, method = "GET", ...rest } = init;

  const response = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    ...rest,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get: <T>(endpoint: string, init: Omit<ApiRequestInit, "method"> = {}) =>
    apiRequest<T>(endpoint, { ...init, method: "GET" }),
  post: <T>(
    endpoint: string,
    body?: unknown,
    init: Omit<ApiRequestInit, "method" | "body"> = {},
  ) => apiRequest<T>(endpoint, { ...init, method: "POST", body }),
  put: <T>(
    endpoint: string,
    body?: unknown,
    init: Omit<ApiRequestInit, "method" | "body"> = {},
  ) => apiRequest<T>(endpoint, { ...init, method: "PUT", body }),
  patch: <T>(
    endpoint: string,
    body?: unknown,
    init: Omit<ApiRequestInit, "method" | "body"> = {},
  ) => apiRequest<T>(endpoint, { ...init, method: "PATCH", body }),
  delete: <T>(endpoint: string, init: Omit<ApiRequestInit, "method"> = {}) =>
    apiRequest<T>(endpoint, { ...init, method: "DELETE" }),
};
