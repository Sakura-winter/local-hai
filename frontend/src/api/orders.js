import { apiClient, USE_MOCK } from './client';
import { getMockOrders, saveMockOrders, getMockProducts, saveMockProducts, getMockShops } from './mockStorage';

export async function createOrderApi({ shop_id, delivery_address, notes = '', items = [] }) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 300));
    const products = getMockProducts();
    const shops = getMockShops();
    const shop = shops.find(s => String(s.id) === String(shop_id));

    // Verify stock and calculate total
    let total_amount = 0;
    const orderItems = [];

    for (const item of items) {
      const prod = products.find(p => String(p.id) === String(item.product_id));
      if (!prod) {
        throw new Error(`Product #${item.product_id} no longer exists.`);
      }
      if (prod.stock < item.quantity) {
        throw new Error(`Insufficient stock for "${prod.name}". Available: ${prod.stock}, Requested: ${item.quantity}`);
      }
      // Decrement stock
      prod.stock -= item.quantity;
      const subtotal = Number((prod.price * item.quantity).toFixed(2));
      total_amount += subtotal;
      orderItems.push({
        product_id: prod.id,
        name: prod.name,
        quantity: item.quantity,
        unit_price: prod.price,
        subtotal
      });
    }

    saveMockProducts(products);

    const userRaw = localStorage.getItem('localhai_user');
    const user = userRaw ? JSON.parse(userRaw) : { id: 1, full_name: 'Peter Parker' };

    const newOrder = {
      id: Date.now(),
      order_number: `LH-${Math.floor(1000 + Math.random() * 9000)}`,
      shop_id: Number(shop_id),
      shop_name: shop ? shop.name : "Local Store",
      customer_id: user.id,
      customer_name: user.full_name,
      customer_phone: "+91 98765 43210",
      delivery_address,
      status: "placed",
      total_amount: Number(total_amount.toFixed(2)),
      notes,
      created_at: new Date().toISOString(),
      items: orderItems
    };

    const orders = getMockOrders();
    orders.unshift(newOrder);
    saveMockOrders(orders);

    return newOrder;
  }

  return apiClient('/orders', {
    method: 'POST',
    body: { shop_id, delivery_address, notes, items }
  });
}

export async function getCustomerOrdersApi() {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 150));
    const orders = getMockOrders();
    const userRaw = localStorage.getItem('localhai_user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    if (!user) return orders;
    return orders.filter(o => String(o.customer_id) === String(user.id) || !o.customer_id);
  }

  return apiClient('/orders');
}

export async function getOrderApi(orderId) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 150));
    const orders = getMockOrders();
    const order = orders.find(o => String(o.id) === String(orderId) || o.order_number === orderId);
    if (!order) throw new Error("Order not caught in the web!");
    return order;
  }

  return apiClient(`/orders/${orderId}`);
}

export async function cancelOrderApi(orderId) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 200));
    const orders = getMockOrders();
    const order = orders.find(o => String(o.id) === String(orderId));
    if (!order) throw new Error("Order not found");
    if (order.status !== 'placed') {
      throw new Error("Cannot cancel an order that is already accepted or delivered.");
    }
    order.status = 'cancelled';
    saveMockOrders(orders);
    return order;
  }

  return apiClient(`/orders/${orderId}`, {
    method: 'DELETE'
  });
}

