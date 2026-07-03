import { api } from "./api";

export interface ProviderSummary {
  id: string;
  businessName: string;
  category: string;
  city: string;
  district: string | null;
  rating: number;
  reviewCount: number;
  logoUrl: string | null;
  firstPhotoUrl: string | null;
  featured: boolean;
}

export interface ProviderDetail {
  id: string;
  businessName: string;
  category: string;
  subcategory: string | null;
  description: string | null;
  city: string;
  district: string | null;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  socialLinks: string | null;
  pricing: string | null;
  latitude: number | null;
  longitude: number | null;
  logoUrl: string | null;
  rating: number;
  reviewCount: number;
  photoUrls: string[];
  createdAt: string;
}

export interface ProviderFormData {
  businessName: string;
  categorySlug: string;
  subcategory?: string;
  description?: string;
  city: string;
  district?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  socialLinks?: string;
  pricing?: string;
  latitude?: number;
  longitude?: number;
  logoUrl?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export async function getFeaturedProviders(): Promise<ProviderSummary[]> {
  const res = await api.get<ProviderSummary[]>("/providers/featured");
  return res.data;
}

export async function searchProviders(params: {
  query?: string;
  city?: string;
  category?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<ProviderSummary>> {
  const search = new URLSearchParams();
  if (params.query) search.set("query", params.query);
  if (params.city) search.set("city", params.city);
  if (params.category) search.set("category", params.category);
  if (params.page) search.set("page", String(params.page));
  if (params.size) search.set("size", String(params.size));
  const res = await api.get<PageResponse<ProviderSummary>>(
    `/providers?${search.toString()}`
  );
  return res.data;
}

export async function getProviderDetail(id: string): Promise<ProviderDetail> {
  const res = await api.get<ProviderDetail>(`/providers/${id}`);
  return res.data;
}

export async function getMyProviderProfile(): Promise<ProviderDetail> {
  const res = await api.get<ProviderDetail>("/providers/me");
  return res.data;
}

export async function createProvider(
  data: ProviderFormData
): Promise<ProviderDetail> {
  const res = await api.post<ProviderDetail>("/providers", data);
  return res.data;
}

export async function updateProvider(
  data: ProviderFormData
): Promise<ProviderDetail> {
  const res = await api.put<ProviderDetail>("/providers/me", data);
  return res.data;
}
