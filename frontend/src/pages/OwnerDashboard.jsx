import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOwnerShopsApi, getOwnerOrdersApi, updateOrderStatusApi, getOwnerStatsApi } from '../api';
import { useAuth } from '../context/AuthContext';

export function OwnerDashboard() {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total_orders: 0,
    pending_orders: 0,
    active_products: 0,
    revenue_today: 0,
    revenue_total: 0
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const loadDashboardData = async () => {
    try {
      const shops = await getOwnerShopsApi();
      const currentShop = shops[0] || { id: 1, name: 'Lakshmi Provision Store', address: 'Indiranagar' };
      setShop(currentShop);

      const [ordersData, statsData] = await Promise.all([
        getOwnerOrdersApi({ shop_id: currentShop.id }),
        getOwnerStatsApi(currentShop.id)
      ]);

      setOrders(ordersData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load merchant data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setActionLoading(orderId);
    try {
      await updateOrderStatusApi(orderId, newStatus);
      // Reload stats and orders
      await loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="w-full min-h-screen bg-background pb-16">
      {/* Top Banner Header */}
      <div className="bg-surface-container-lowest border-b border-surface-variant py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[32px]">newspaper</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
                  The Daily Bugle
                </span>
                <span className="text-secondary text-xs">• Merchant Command Center</span>
              </div>
              <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface mt-1">
                {shop?.name || "Your Store"}
              </h1>
              <p className="font-body-sm text-xs text-secondary mt-0.5">
                {shop?.address} • Managed by {user?.full_name || 'Owner'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/owner/inventory"
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              <span>Manage Store Inventory</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Daily Bugle Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Orders */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-variant flex items-center justify-between">
            <div>
              <span className="text-xs text-secondary font-medium block">Total Orders</span>
              <div className="font-headline-lg text-2xl font-bold text-on-surface mt-1">
                {stats.total_orders}
              </div>
              <span className="text-[11px] text-tertiary font-medium">Recorded in registry</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-surface-container-low text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            </div>
          </div>

          {/* Pending Orders (Spider Alert) */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-primary/30 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-xs text-secondary font-medium block">Incoming / Pending</span>
              <div className="font-headline-lg text-2xl font-bold text-primary mt-1">
                {stats.pending_orders}
              </div>
              <span className="text-[11px] text-primary font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Action needed
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">pending_actions</span>
            </div>
          </div>

          {/* Revenue Today */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-variant flex items-center justify-between">
            <div>
              <span className="text-xs text-secondary font-medium block">Gross Revenue</span>
              <div className="font-headline-lg text-2xl font-bold text-tertiary mt-1">
                ₹{stats.revenue_total}
              </div>
              <span className="text-[11px] text-secondary">Zero platform deduction</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
          </div>

          {/* Active Products */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-variant flex items-center justify-between">
            <div>
              <span className="text-xs text-secondary font-medium block">Counter Items</span>
              <div className="font-headline-lg text-2xl font-bold text-on-surface mt-1">
                {stats.active_products}
              </div>
              <span className="text-[11px] text-secondary">Live on customer app</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-surface-container-low text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">shelves</span>
            </div>
          </div>
        </div>

        {/* Incoming & Active Customer Orders Section */}
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden shadow-xs">
          <div className="p-5 border-b border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-headline-md text-lg font-bold text-on-surface">
                Incoming & Active Customer Orders
              </h2>
              <p className="font-body-sm text-xs text-secondary mt-0.5">
                Review neighbourhood requests, accept and mark orders delivered
              </p>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl overflow-x-auto">
              {[
                { label: 'All', val: 'all' },
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

          {loading ? (
            <div className="p-8 text-center text-secondary text-xs">
              <span className="material-symbols-outlined animate-spin text-[28px] text-primary mb-2">progress_activity</span>
              <div>Loading The Daily Bugle records...</div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-secondary">
              <span className="material-symbols-outlined text-[44px] text-secondary/50 mb-2">inbox</span>
              <p className="font-headline-sm text-sm font-bold text-on-surface">No orders in this status.</p>
              <p className="font-body-sm text-xs mt-1">When residents swing orders by your counter, they'll appear here.</p>
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
                      {order.customer_phone && (
                        <span className="text-xs text-secondary font-medium">
                          ({order.customer_phone})
                        </span>
                      )}
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
                        <span>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions & Bill */}
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
                            <span>Accept Order</span>
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

