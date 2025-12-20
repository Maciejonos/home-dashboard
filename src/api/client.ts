export function callApi<T>(
  path: string,
  { host, ...options }: RequestInit & { host?: string } = {}
): Promise<T> {
  return fetch(`http://${host ?? "localhost:18745"}/api/${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }).then((res) => {
    if (!res.ok) {
      return Promise.reject(
        new Error(`API call failed with status ${res.status}`)
      );
    }

    if (res.status === 204) return Promise.resolve(true) as any;

    return res.json() as Promise<T>;
  });
}
