import { API_BASE_URL } from "../config";
import type {
  AuthRegisterPayload,
  AuthResponse,
  Look,
  MockOffer,
  ProductCreate,
  ReadinessReport,
  Tutorial,
  User,
  UserProduct
} from "../types";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
};

let authToken: string | null = null;

export function setApiAuthToken(token: string | null) {
  authToken = token;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const init: RequestInit = {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
    }
  };

  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, init);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  register: (payload: AuthRegisterPayload) => request<AuthResponse>("/auth/register", { method: "POST", body: payload }),
  login: (email: string, password: string) => request<AuthResponse>("/auth/login", { method: "POST", body: { email, password } }),
  getCurrentUser: () => request<User>("/auth/me"),
  logout: () => request<void>("/auth/logout", { method: "POST" }),
  getLooks: () => request<Look[]>("/looks"),
  getLook: (lookId: number) => request<Look>(`/looks/${lookId}`),
  getTutorial: (lookId: number) => request<Tutorial>(`/looks/${lookId}/tutorial`),
  getUserProducts: (userId: number) => request<UserProduct[]>(`/users/${userId}/products`),
  createUserProduct: (userId: number, product: ProductCreate) =>
    request<UserProduct>(`/users/${userId}/products`, { method: "POST", body: product }),
  deleteUserProduct: (userId: number, productId: number) =>
    request<void>(`/users/${userId}/products/${productId}`, { method: "DELETE" }),
  getReadinessReport: (userId: number, lookId: number) =>
    request<ReadinessReport>(`/users/${userId}/looks/${lookId}/readiness`, { method: "POST" }),
  getMockOffers: (gapId: string) => request<MockOffer[]>(`/shopping-gaps/${gapId}/mock-offers`)
};
