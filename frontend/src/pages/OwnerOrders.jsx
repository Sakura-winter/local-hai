import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOwnerShopsApi, getOwnerOrdersApi, updateOrderStatusApi } from '../api';

export function OwnerOrders() {
  const [shop, setShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const loadOrders = async () => {
    try {
      const shops = await getOwnerShopsApi();
      const currentShop = shops[0] || { id: 1, name: 'Lakshmi Provision Store' };
      setShop(currentShop);

      const ordersData = await getOwnerOrdersApi({ shop_id: currentShop.id });
      setOrders(ordersData);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setActionLoading(orderId);
    try {
      await updateOrderStatusApi(orderId, newStatus);
      await loadOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      (o.order_number && o.order_number.toLowerCase().includes(search.toLowerCase())) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(search.toLowerCase())) ||
      (o.delivery_address && o.delivery_address.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-background pb-16">
      {/* Top Banner Header */}
      <div className="bg-surface-container-lowest border-b border-surface-variant py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-secondary mb-2">
              <Link to="/owner/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                <span>The Daily Bugle</span>
              </Link>
              <span>/</span>
              <span className="text-on-surface font-semibold">Store Orders</span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">
              Customer Orders
            </h1>
            <p className="font-body-sm text-xs text-secondary mt-1">
              Incoming and active customer orders for {shop?.name || 'your store'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/owner/dashboard"
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors"
            >
              Dashboard Stats
            </Link>
            <Link
              to="/owner/inventory"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-colors"
            >
              Manage Inventory
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls: Search & Status Tabs */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, resident name, address..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl overflow-x-auto">
            {[
              { label: 'All Orders', val: 'all' },
              { label: 'New (Placed)', val: 'placed' },
              { label: 'Accepted', val: 'accepted' },
              { label: 'Delivered', val: 'delivered' },
              { label: 'Cancelled', val: 'cancelled' },
            ].map(t => (
              <button
                key={t.val}
                type="button"
                onClick={() => setStatusFilter(t.val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === t.val
                    ? 'bg-surface-container-lowest text-primary shadow-2xs'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-secondary text-xs">
              <span className="material-symbols-outlined animate-spin text-[32px] text-primary mb-2">progress_activity</span>
              <div>Loading store orders...</div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-secondary">
              <span className="material-symbols-outlined text-[48px] text-secondary/60 mb-2">inbox</span>
              <p className="font-headline-sm text-base font-bold text-on-surface">No orders matched.</p>
              <p className="font-body-sm text-xs mt-1">Try selecting a different status filter or clear your search.</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-container">
              {filteredOrders.map(order => (
                <div key={order.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-surface-container-low/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-headline-md text-base font-bold text-primary">
                        {order.order_number || `LH-${order.id}`}
                      </span>
                      <span className="text-secondary">•</span>
                      <span className="font-bold text-sm text-on-surface">
                        {order.customer_name || 'Resident Customer'}
                      </span>

                      {order.status === 'placed' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                          New Order
                        </span>
                      )}
                      {order.status === 'accepted' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                          Accepted & Packing
                        </span>
                      )}
                      {order.status === 'delivered' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          Delivered ✓
                        </span>
                      )}
                      {order.status === 'cancelled' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
                          Cancelled
                        </span>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="bg-surface-container-low/60 rounded-xl p-3 border border-surface-container/60 mb-2">
                      <div className="text-xs font-semibold text-secondary mb-1">Items requested:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between pr-4">
                            <span className="text-on-surface">
                              <strong className="text-primary">{item.quantity}x</strong> {item.name}
                            </span>
                            <span className="text-secondary font-medium">₹{item.subtotal || (item.unit_price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-secondary">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">pin_drop</span>
                        <span>{order.delivery_address}</span>
                      </span>
                      {order.notes && (
                        <span className="flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                          <span className="material-symbols-outlined text-[14px]">chat</span>
                          <span>Note: "{order.notes}"</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">schedule</span>
                        <span>{new Date(order.created_at).toLocaleString()}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-surface-container">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] text-secondary font-medium">Order Total</span>
                      <div className="font-headline-md text-xl font-bold text-on-surface">
                        ₹{order.total_amount}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === 'placed' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(order.id, 'accepted')}
                            disabled={actionLoading === order.id}
                            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            <span>Accept</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                            disabled={actionLoading === order.id}
                            className="px-3 py-2 rounded-xl border border-error/30 text-error hover:bg-error-container text-xs font-bold transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {order.status === 'accepted' && (
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(order.id, 'delivered')}
                          disabled={actionLoading === order.id}
                          className="px-4 py-2 rounded-xl bg-tertiary hover:bg-emerald-700 text-on-tertiary font-label-md text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">done_all</span>
                          <span>Mark Delivered</span>
                        </button>
                      )}

                      {order.status === 'delivered' && (
                        <span className="text-xs font-bold text-tertiary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          Fulfilled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

