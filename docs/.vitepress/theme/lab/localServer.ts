const LOCAL_SERVER_URL = `http://127.0.0.1:${import.meta.env.VITE_LABS_PORT || "4180"}`;

export interface LocalStatus {
  running: boolean;
  url: string | null;
  logs: string;
  exitCode: number | null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = options?.body
    ? {
        "content-type": "application/json",
        ...options?.headers,
      }
    : options?.headers;

  const response = await fetch(`${LOCAL_SERVER_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || payload.output || "Local lab request failed.");
  }
  return payload as T;
}

export async function checkLocalServer() {
  try {
    const response = await fetch(`${LOCAL_SERVER_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export function readLocalFiles(projectId: string) {
  return request<{ files: Record<string, string> }>(`/api/labs/${projectId}/files`);
}

export function saveLocalFile(projectId: string, path: string, content: string) {
  return request<{ ok: boolean }>(`/api/labs/${projectId}/files`, {
    method: "PUT",
    body: JSON.stringify({ path, content }),
  });
}

export function installLocalLab(projectId: string) {
  return request<{ ok: boolean; output: string; code: number }>(`/api/labs/${projectId}/install`, {
    method: "POST",
    body: "{}",
  });
}

export function runLocalLab(projectId: string) {
  return request<{ ok: boolean; url: string; port: number }>(`/api/labs/${projectId}/run`, {
    method: "POST",
    body: "{}",
  });
}

export function stopLocalLab(projectId: string) {
  return request<{ ok: boolean; stopped: boolean }>(`/api/labs/${projectId}/stop`, {
    method: "POST",
    body: "{}",
  });
}

export function readLocalStatus(projectId: string) {
  return request<LocalStatus>(`/api/labs/${projectId}/status`);
}
