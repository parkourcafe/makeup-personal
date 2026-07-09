import { API_BASE_URL } from "../config";
import type { Look, ProductCreate, ReadinessReport, Tutorial, UserProduct } from "../types";

type RequestOptions = {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const init: RequestInit = {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json"
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
  getLooks: () => request<Look[]>("/looks"),
  getLook: (lookId: number) => request<Look>(`/looks/${lookId}`),
  getTutorial: (lookId: number) => request<Tutorial>(`/looks/${lookId}/tutorial`),
  getUserProducts: (userId: number) => request<UserProduct[]>(`/users/${userId}/products`),
  createUserProduct: (userId: number, product: ProductCreate) =>
    request<UserProduct>(`/users/${userId}/products`, { method: "POST", body: product }),
  deleteUserProduct: (userId: number, productId: number) =>
    request<void>(`/users/${userId}/products/${productId}`, { method: "DELETE" }),
  getReadinessReport: (userId: number, lookId: number) =>
    request<ReadinessReport>(`/users/${userId}/looks/${lookId}/readiness`, { method: "POST" })
};
