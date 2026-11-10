import { INITIAL_SHOPS, INITIAL_PRODUCTS, INITIAL_ORDERS, DEMO_USERS } from '../mock/data';

const SHOPS_KEY = 'localhai_mock_shops';
const PRODUCTS_KEY = 'localhai_mock_products';
const ORDERS_KEY = 'localhai_mock_orders';
const USERS_KEY = 'localhai_mock_users';

function getOrInit(key, initialData) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(raw);
  } catch (e) {
    return initialData;
  }
}

export function getMockShops() {
  return getOrInit(SHOPS_KEY, INITIAL_SHOPS);
}

export function saveMockShops(shops) {
  localStorage.setItem(SHOPS_KEY, JSON.stringify(shops));
}

export function getMockProducts() {
  return getOrInit(PRODUCTS_KEY, INITIAL_PRODUCTS);
}

export function saveMockProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function getMockOrders() {
  return getOrInit(ORDERS_KEY, INITIAL_ORDERS);
}

export function saveMockOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getMockUsers() {
  return getOrInit(USERS_KEY, [
    DEMO_USERS.customer,
    DEMO_USERS.shop_owner
  ]);
}

export function saveMockUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

