/**
 * API Service Module
 * Handles HTTP requests to the Laravel backend for property search
 */

const BASE_URL = "http://127.0.0.1:8000/api";

/**
 * Search properties with optional filters
 * @param {Object} params - Search parameters
 * @param {string} [params.name] - Property name (partial match)
 * @param {number} [params.bedrooms] - Number of bedrooms (exact match)
 * @param {number} [params.bathrooms] - Number of bathrooms (exact match)
 * @param {number} [params.storeys] - Number of storeys (exact match)
 * @param {number} [params.garages] - Number of garages (exact match)
 * @param {number} [params.price_min] - Minimum price
 * @param {number} [params.price_max] - Maximum price
 * @param {number} [params.page] - Page number for pagination
 * @returns {Promise<Object>} Paginated property results
 */
export async function searchProperties(params = {}) {
  const queryParams = new URLSearchParams();

  // Only add non-empty parameters to the query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      queryParams.append(key, value);
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
 * @param {number} price - Price value
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
