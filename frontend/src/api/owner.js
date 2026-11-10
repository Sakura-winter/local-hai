import { apiClient, USE_MOCK } from './client';
import {
  getMockShops,
  getMockProducts,
  saveMockProducts,
  getMockOrders,
  saveMockOrders
} from './mockStorage';

export async function getOwnerShopsApi() {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 150));
    const shops = getMockShops();
    const userRaw = localStorage.getItem('localhai_user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    if (!user) return shops.slice(0, 1);
    const ownerShops = shops.filter(s => String(s.owner_id) === String(user.id));
    return ownerShops.length ? ownerShops : shops.slice(0, 1);
  }
  return apiClient('/owner/shops');
}

export async function getOwnerProductsApi(shopId) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 150));
    const products = getMockProducts();
    if (!shopId) return products.filter(p => p.shop_id === 1);
    return products.filter(p => String(p.shop_id) === String(shopId));
  }
  const q = shopId ? `?shop_id=${shopId}` : '';
  return apiClient(`/owner/products${q}`);
}

export async function createProductApi(productData) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 200));
    const products = getMockProducts();
    const newProduct = {
      id: Date.now(),
      shop_id: Number(productData.shop_id || 1),
      name: productData.name,
      description: productData.description || '',
      price: Number(productData.price),
      stock: Number(productData.stock || 0),
      category: productData.category || 'General Kirana',
      image_url: productData.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
      is_available: true,
      created_at: new Date().toISOString()
    };
    products.unshift(newProduct);
    saveMockProducts(products);
    return newProduct;
  }
  return apiClient('/owner/products', {
    method: 'POST',
    body: productData
  });
}

export async function updateProductApi(productId, updateData) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 200));
    const products = getMockProducts();
    const idx = products.findIndex(p => String(p.id) === String(productId));
    if (idx === -1) throw new Error("Product not found");
    products[idx] = {
      ...products[idx],
      ...updateData,
      price: updateData.price !== undefined ? Number(updateData.price) : products[idx].price,
      stock: updateData.stock !== undefined ? Number(updateData.stock) : products[idx].stock,
    };
    saveMockProducts(products);
    return products[idx];
  }
  return apiClient(`/owner/products/${productId}`, {
    method: 'PUT',
    body: updateData
  });
}

export async function deleteProductApi(productId) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 200));
    const products = getMockProducts();
    const filtered = products.filter(p => String(p.id) !== String(productId));
    saveMockProducts(filtered);
    return { message: "Product deleted from inventory" };
  }
  return apiClient(`/owner/products/${productId}`, {
    method: 'DELETE'
  });
}

export async function getOwnerOrdersApi({ shop_id, status } = {}) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 150));
    let orders = getMockOrders();
    if (shop_id) {
      orders = orders.filter(o => String(o.shop_id) === String(shop_id));
    }
    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }
    return orders;
  }
  const params = new URLSearchParams();
  if (shop_id) params.append('shop_id', shop_id);
  if (status && status !== 'all') params.append('status', status);
  const qStr = params.toString() ? `?${params.toString()}` : '';
  return apiClient(`/owner/orders${qStr}`);
}

export async function updateOrderStatusApi(orderId, newStatus) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 200));
    const orders = getMockOrders();
    const order = orders.find(o => String(o.id) === String(orderId));
    if (!order) throw new Error("Order not found");
    order.status = newStatus;
    saveMockOrders(orders);
    return order;
  }
  return apiClient(`/owner/orders/${orderId}/status`, {
    method: 'PATCH',
    body: { status: newStatus }
  });
}

export async function getOwnerStatsApi(shopId) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 150));
    const orders = getMockOrders();
    const products = getMockProducts();
    const shopOrders = shopId ? orders.filter(o => String(o.shop_id) === String(shopId)) : orders;
    const shopProducts = shopId ? products.filter(p => String(p.shop_id) === String(shopId)) : products;

    const total_orders = shopOrders.length;
    const pending_orders = shopOrders.filter(o => o.status === 'placed').length;
    const revenue_total = shopOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const revenue_today = shopOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    return {
      total_orders,
      pending_orders,
      active_products: shopProducts.length,
      revenue_today: Number(revenue_today.toFixed(2)),
      revenue_total: Number(revenue_total.toFixed(2))
    };
  }
  const q = shopId ? `?shop_id=${shopId}` : '';
  return apiClient(`/owner/stats${q}`);
}

