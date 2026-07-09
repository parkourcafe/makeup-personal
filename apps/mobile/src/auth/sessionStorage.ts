const AUTH_TOKEN_KEY = "makeup_personal_auth_token";
let memoryToken: string | null = null;

export async function readStoredAuthToken(): Promise<string | null> {
  const storage = browserStorage();
  if (storage) {
    return storage.getItem(AUTH_TOKEN_KEY);
  }
  return memoryToken;
}

export async function writeStoredAuthToken(token: string): Promise<void> {
  memoryToken = token;
  const storage = browserStorage();
  if (storage) {
    storage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export async function clearStoredAuthToken(): Promise<void> {
  memoryToken = null;
  const storage = browserStorage();
  if (storage) {
    storage.removeItem(AUTH_TOKEN_KEY);
  }
}

function browserStorage(): Storage | null {
  try {
    return typeof globalThis.localStorage === "undefined" ? null : globalThis.localStorage;
  } catch {
    return null;
  }
}
