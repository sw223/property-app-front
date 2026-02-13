export interface SearchParams {
  name?: string;
  bedrooms?: number;
  bathrooms?: number;
  storeys?: number;
  garages?: number;
  price_min?: number;
  price_max?: number;
  page?: number;
  per_page?: number;
}

export interface SearchFormData {
  name: string;
  bedrooms: number | null;
  bathrooms: number | null;
  storeys: number | null;
  garages: number | null;
  price_min: number | null;
  price_max: number | null;
}

export interface Property {
  id: number;
  name: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  storeys: number;
  garages: number;
  created_at: string;
  updated_at: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
}

export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
