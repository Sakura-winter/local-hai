import { apiClient, USE_MOCK } from './client';
import { getMockProducts, getMockShops } from './mockStorage';

export async function searchGlobalProductsApi(query = '') {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 150));
    if (!query.trim()) return [];
    const products = getMockProducts();
    const shops = getMockShops();
    const q = query.toLowerCase();

    return products
      .filter(p => p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q)))
      .map(p => ({
        ...p,
        shop: shops.find(s => String(s.id) === String(p.shop_id))
      }));
  }

  return apiClient(`/products/search?q=${encodeURIComponent(query)}`);
}

