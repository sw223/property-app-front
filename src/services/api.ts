import type { SearchParams, PaginatedResponse, Property } from "@/types/property";

const BASE_URL = "http://127.0.0.1:8000/api";

/**
 * Search properties with optional filters
 * @param params - Search parameters
 * @returns Paginated property results
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

  const url = `${BASE_URL}/properties/search?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Property search error:", error);
    throw error;
  }
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
