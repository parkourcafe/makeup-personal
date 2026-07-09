import type { Look, LookRole, Store, StoreOffer, Tutorial, TutorialStep, Vocabulary } from "./types";

const LOCAL_API_BASE_URL = "http://127.0.0.1:8000";
const PRODUCTION_API_BASE_URL = "https://makeup-personal-api.vercel.app";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? LOCAL_API_BASE_URL : PRODUCTION_API_BASE_URL);
const ADMIN_TOKEN_KEY = "makeup_personal_admin_token";
let adminToken = readInitialAdminToken();

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(adminToken ? { "X-Admin-Token": adminToken } : {})
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });

  if (!response.ok) {
    throw new Error((await response.text()) || `API request failed with ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export function getAdminToken(): string {
  return adminToken;
}

export function setAdminToken(token: string): void {
  adminToken = token.trim();
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ADMIN_TOKEN_KEY, adminToken);
  }
}

function readInitialAdminToken(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
}

export const api = {
  listLooks: () => request<Look[]>("/admin/looks"),
  createLook: (body: Partial<Look>) => request<Look>("/admin/looks", { method: "POST", body }),
  updateLook: (id: number, body: Partial<Look>) => request<Look>(`/admin/looks/${id}`, { method: "PUT", body }),
  deleteLook: (id: number) => request<void>(`/admin/looks/${id}`, { method: "DELETE" }),
  listRoles: (lookId: number) => request<LookRole[]>(`/admin/look-roles?look_id=${lookId}`),
  createRole: (body: Partial<LookRole>) => request<LookRole>("/admin/look-roles", { method: "POST", body }),
  deleteRole: (id: number) => request<void>(`/admin/look-roles/${id}`, { method: "DELETE" }),
  listTutorials: (lookId: number) => request<Tutorial[]>(`/admin/tutorials?look_id=${lookId}`),
  createTutorial: (body: Partial<Tutorial>) => request<Tutorial>("/admin/tutorials", { method: "POST", body }),
  updateTutorial: (id: number, body: Partial<Tutorial>) => request<Tutorial>(`/admin/tutorials/${id}`, { method: "PUT", body }),
  deleteTutorial: (id: number) => request<void>(`/admin/tutorials/${id}`, { method: "DELETE" }),
  createStep: (body: Partial<TutorialStep>) => request<TutorialStep>("/admin/tutorial-steps", { method: "POST", body }),
  deleteStep: (id: number) => request<void>(`/admin/tutorial-steps/${id}`, { method: "DELETE" }),
  listStores: () => request<Store[]>("/admin/stores"),
  createStore: (body: Partial<Store>) => request<Store>("/admin/stores", { method: "POST", body }),
  listOffers: () => request<StoreOffer[]>("/admin/store-offers"),
  createOffer: (body: Partial<StoreOffer>) => request<StoreOffer>("/admin/store-offers", { method: "POST", body }),
  deleteOffer: (id: number) => request<void>(`/admin/store-offers/${id}`, { method: "DELETE" }),
  getVocabulary: () => request<Vocabulary>("/vocabulary")
};
