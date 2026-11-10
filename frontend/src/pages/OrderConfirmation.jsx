import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getOrderApi } from '../api';

export function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      async function fetchOrder() {
        try {
          const data = await getOrderApi(id);
          setOrder(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined animate-spin text-[36px] text-primary">progress_activity</span>
        <p className="font-body-md text-secondary">Catching order details in the web...</p>
      </div>
    );
  }

  const orderNum = order?.order_number || `LH-${id}`;

  return (
    <div className="w-full min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 sm:p-10 shadow-sm flex flex-col items-center text-center">
        {/* Spider-Man Web Hero Icon */}
        <div className="w-20 h-20 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[44px]">task_alt</span>
        </div>

        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
          Swing in Progress
        </span>

        <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface mb-2">
          Order caught in the web!
        </h1>

        <p className="font-body-lg text-sm sm:text-base text-secondary max-w-md mb-6">
          Your friendly neighbourhood storekeeper has received your request and is packing it fresh from the counter.
        </p>

        {/* Order Identifier & Time Card */}
        <div className="w-full bg-surface-container-low rounded-2xl p-4 border border-surface-container mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div>
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Order Reference</span>
            <div className="font-headline-md text-lg font-bold text-primary">{orderNum}</div>
            <div className="text-xs text-secondary">{order?.shop_name || 'Neighbourhood Store'}</div>
          </div>
          <div className="sm:text-right">
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Estimated Swing</span>
            <div className="font-headline-md text-lg font-bold text-tertiary">15-25 Mins</div>
            <div className="text-xs text-secondary">Pay at counter delivery</div>
          </div>
        </div>

        {/* Status Stepper */}
        <div className="w-full py-4 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-surface-container -z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-xs">
                <span className="material-symbols-outlined text-[18px]">receipt</span>
              </div>
              <span className="text-[11px] font-bold text-primary mt-1">Placed</span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                order?.status === 'accepted' || order?.status === 'delivered'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-secondary border border-surface-container'
              }`}>
                <span className="material-symbols-outlined text-[18px]">store</span>
              </div>
              <span className="text-[11px] font-semibold text-secondary mt-1">Accepted</span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                order?.status === 'delivered'
                  ? 'bg-tertiary text-on-tertiary'
                  : 'bg-surface-container-low text-secondary border border-surface-container'
              }`}>
                <span className="material-symbols-outlined text-[18px]">done_all</span>
              </div>
              <span className="text-[11px] font-semibold text-secondary mt-1">Delivered</span>
            </div>
          </div>
        </div>

        {/* Order Details Breakdown */}
        {order?.items && order.items.length > 0 && (
          <div className="w-full text-left bg-surface-container-lowest border border-surface-variant rounded-xl p-4 mb-6">
            <h3 className="font-headline-sm text-xs font-bold text-secondary uppercase tracking-wider mb-3">
              Items Ordered
            </h3>
            <div className="divide-y divide-surface-container text-xs">
              {order.items.map((i, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">{i.quantity}x</span>
                    <span className="text-on-surface">{i.name}</span>
                  </div>
                  <span className="font-bold text-on-surface">₹{i.subtotal || (i.unit_price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 mt-2 border-t border-surface-container flex items-center justify-between text-sm font-bold">
              <span>Total Amount</span>
              <span className="text-primary">₹{order.total_amount}</span>
            </div>
          </div>
        )}

        {/* Address */}
        {order?.delivery_address && (
          <div className="w-full text-left bg-surface-container-low/50 rounded-xl p-3 border border-surface-container mb-6 text-xs text-secondary">
            <span className="font-bold text-on-surface block mb-0.5">Delivery Destination:</span>
            {order.delivery_address}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link
            to="/orders"
            className="w-full sm:flex-1 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>View All My Orders</span>
          </Link>
          <Link
            to="/"
            className="w-full sm:flex-1 py-3 rounded-xl border border-surface-container hover:bg-surface-container text-on-surface font-label-md text-sm font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>Swing to other shops</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

