import { apiClient, USE_MOCK } from './client';
import { getMockUsers, saveMockUsers, getMockShops, saveMockShops } from './mockStorage';
import { DEMO_USERS } from '../mock/data';

export async function loginApi({ email, password }) {
  if (USE_MOCK) {
    // Artificial latency
    await new Promise(r => setTimeout(r, 200));

    const users = getMockUsers();
    let foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      if (email.toLowerCase().includes('gupta') || email.toLowerCase().includes('owner') || email.toLowerCase().includes('shop')) {
        foundUser = DEMO_USERS.shop_owner;
      } else {
        foundUser = {
          id: Date.now(),
          email,
          full_name: email.split('@')[0],
          role: 'customer'
        };
      }
    }

    const token = `mock-jwt-token-${foundUser.role}-${Date.now()}`;
    return {
      access_token: token,
      token_type: 'bearer',
      user: foundUser
    };
  }

  return apiClient('/auth/login', {
    method: 'POST',
    body: { email, password }
  });
}

export async function registerApi({ email, password, full_name, role, shop_name, shop_address, shop_category }) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 200));
    const users = getMockUsers();
    const newUser = {
      id: Date.now(),
      email,
      full_name,
      role: role || 'customer',
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    saveMockUsers(users);

    if (role === 'shop_owner') {
      const shops = getMockShops();
      const newShop = {
        id: Date.now() + 1,
        owner_id: newUser.id,
        owner_name: full_name,
        name: shop_name || `${full_name}'s Kirana`,
        description: "Your neighbourhood store on Local Hai",
        address: shop_address || "Local neighbourhood",
        category: shop_category || "Kirana & Daily Essentials",
        is_active: true,
        rating: 5.0,
        reviews_count: 0,
        delivery_time: "15-25 mins",
        badge: "New Hero Store",
        banner_url: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&auto=format&fit=crop&q=80",
        open_now: true
      };
      shops.push(newShop);
      saveMockShops(shops);
      newUser.shop_id = newShop.id;
      newUser.shop_name = newShop.name;
    }

    const token = `mock-jwt-token-${newUser.role}-${Date.now()}`;
    return {
      access_token: token,
      token_type: 'bearer',
      user: newUser
    };
  }

  return apiClient('/auth/register', {
    method: 'POST',
    body: { email, password, full_name, role }
  });
}

export async function getMeApi() {
  if (USE_MOCK) {
    const raw = localStorage.getItem('localhai_user');
    return raw ? JSON.parse(raw) : DEMO_USERS.customer;
  }
  return apiClient('/auth/me');
}

