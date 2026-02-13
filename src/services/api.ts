import type { SearchParams, PaginatedResponse, Property, ApiErrorResponse } from "@/types/property";

const BASE_URL = "http://127.0.0.1:8000/api";

export class ApiError extends Error {
  public status: number;
  public errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Search properties with optional filters
 * @param params - Search parameters
 * @returns Paginated property results
 * @throws ApiError when the API returns an error
 */
export async function searchProperties(
  params: SearchParams = {},
): Promise<PaginatedResponse<Property>> {
  const queryParams = new URLSearchParams();

  // Only add non-empty parameters to the query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  // Add page parameter if not present (default to page 1)
  if (!queryParams.has("page")) {
    queryParams.append("page", "1");
  }

  if (!queryParams.has("per_page")) {
    queryParams.append("per_page", "5");
  }

  const url = `${BASE_URL}/properties/search?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let errorData: ApiErrorResponse;
    try {
      errorData = await response.json();
    } catch {
      throw new ApiError(`API request failed with status ${response.status}`, response.status);
    }

    throw new ApiError(
      errorData.message || `API request failed with status ${response.status}`,
      response.status,
      errorData.errors,
    );
  }

  return await response.json();
}

/**
 * Format price as currency
 * @param price - Price value
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
