import { apiClient, USE_MOCK } from './client';
import { getMockShops, getMockProducts } from './mockStorage';

export async function getShopsApi(search = '') {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 150));
    const shops = getMockShops();
    if (!search.trim()) return shops;
    const q = search.toLowerCase();
    return shops.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q)
    );
  }

  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiClient(`/shops${query}`);
}

export async function getShopApi(shopId) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 150));
    const shops = getMockShops();
    const shop = shops.find(s => String(s.id) === String(shopId));
    if (!shop) throw new Error('Store not found in neighbourhood');
    return shop;
  }

  return apiClient(`/shops/${shopId}`);
}

export async function getShopProductsApi(shopId, { search = '', category = '' } = {}) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 150));
    const products = getMockProducts();
    let shopProds = products.filter(p => String(p.shop_id) === String(shopId) && p.is_available);

    if (category && category !== 'All') {
      shopProds = shopProds.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      shopProds = shopProds.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return shopProds;
  }

  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  const qStr = params.toString() ? `?${params.toString()}` : '';
  return apiClient(`/shops/${shopId}/products${qStr}`);
}

