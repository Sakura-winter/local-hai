import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerOrdersApi, cancelOrderApi } from '../api';

export function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const data = await getCustomerOrdersApi();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancellingId(orderId);
    try {
      await cancelOrderApi(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
      setMessage('Order was successfully cancelled.');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert(err.message || 'Could not cancel order.');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'placed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
            Placed
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Accepted by Shop
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check</span>
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            Cancelled
          </span>
        );
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="w-full min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">
              My Orders
            </h1>
            <p className="font-body-md text-xs sm:text-sm text-secondary mt-1">
              Track your neighbourhood deliveries and past orders
            </p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            <span>Shop more</span>
          </Link>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            {message}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(n => (
              <div key={n} className="bg-surface-container-lowest h-36 rounded-2xl animate-pulse border border-surface-variant"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-dashed border-surface-variant flex flex-col items-center">
            <span className="material-symbols-outlined text-[48px] text-secondary/60 mb-2">receipt_long</span>
            <h3 className="font-headline-md text-lg font-bold text-on-surface">No orders caught in your web yet.</h3>
            <p className="font-body-md text-sm text-secondary mt-1 mb-4">Swing by any neighbourhood kirana to place your first order!</p>
            <Link to="/" className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold">
              Browse Shops
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-5 shadow-xs flex flex-col gap-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-md text-base font-bold text-primary">
                      {order.order_number || `LH-${order.id}`}
                    </span>
                    <span className="text-secondary">•</span>
                    <span className="font-bold text-sm text-on-surface">{order.shop_name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="text-xs text-secondary">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    {order.items && order.items.length > 0 ? (
                      <div className="text-xs text-secondary space-y-0.5">
                        {order.items.map((item, idx) => (
                          <div key={idx}>
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-secondary">Groceries & daily essentials</span>
                    )}
                    <p className="text-[11px] text-secondary mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span className="truncate max-w-md">{order.delivery_address}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-[10px] text-secondary">Order Total</span>
                      <div className="font-headline-md text-lg font-bold text-on-surface">
                        ₹{order.total_amount}
                      </div>
                    </div>

                    {order.status === 'placed' && (
                      <button
                        type="button"
                        onClick={() => handleCancel(order.id)}
                        disabled={cancellingId === order.id}
                        className="px-3 py-1.5 rounded-xl border border-error/30 text-error hover:bg-error-container text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        {cancellingId === order.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

