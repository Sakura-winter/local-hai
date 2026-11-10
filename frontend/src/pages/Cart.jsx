import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrderApi } from '../api';

export function Cart() {
  const { cart, shop, items, updateQuantity, removeFromCart, clearCart, subtotal, totalCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || 'Flat 302, Spider Apt, 5th Cross, Indiranagar, Bengaluru');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-16 px-4 py-16 bg-surface-container-lowest rounded-2xl border border-surface-variant text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <span className="material-symbols-outlined text-[42px]">remove_shopping_cart</span>
        </div>
        <h1 className="font-headline-lg text-2xl font-bold text-on-surface mb-2">
          Your web is empty.
        </h1>
        <p className="font-body-md text-sm text-secondary max-w-md mb-6">
          Looks like you haven't spun any neighbourhood items into your cart yet. Swing by a local kirana and fill your pantry!
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">explore</span>
          <span>Browse neighbourhood shops</span>
        </Link>
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    if (!deliveryAddress.trim()) {
      setError('Please provide a delivery address.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const orderPayload = {
        shop_id: shop.id,
        delivery_address: deliveryAddress,
        notes,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      const createdOrder = await createOrderApi(orderPayload);
      // Clear cart upon successful order
      clearCart();
      navigate(`/order/${createdOrder.id || createdOrder.order_number}/confirmation`, {
        state: { order: createdOrder }
      });
    } catch (err) {
      setError(err.message || 'Failed to place order. Please check item stock.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-secondary mb-4">
          <Link to="/" className="hover:text-primary transition-colors">Bazaar</Link>
          <span>/</span>
          {shop && (
            <>
              <Link to={`/shop/${shop.id}`} className="hover:text-primary transition-colors">{shop.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-on-surface font-semibold">Web & Checkout</span>
        </div>

        <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface mb-6">
          Shopping Cart & Delivery
        </h1>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error-container/50 border border-error/20 text-error text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Store info, Cart Items & Delivery Address */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Store Banner Card */}
            {shop && (
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-variant flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">store</span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-base font-bold text-on-surface">{shop.name}</h2>
                    <p className="font-body-sm text-xs text-secondary">{shop.address || 'Neighbourhood Store'}</p>
                  </div>
                </div>

                <Link
                  to={`/shop/${shop.id}`}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  + Add more items
                </Link>
              </div>
            )}

            {/* Cart Items List */}
            <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden">
              <div className="p-4 border-b border-surface-container flex items-center justify-between">
                <span className="font-headline-sm text-sm font-bold text-on-surface">
                  Items in your Web ({totalCount})
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-secondary hover:text-error transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="divide-y divide-surface-container">
                {items.map(item => (
                  <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover bg-surface-container shrink-0"
                      />
                      <div>
                        <h3 className="font-headline-sm text-sm font-bold text-on-surface line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="font-body-sm text-xs text-secondary">
                          ₹{item.price} each {item.unit ? `• ${item.unit}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 bg-surface-container-low rounded-xl px-2 py-1 border border-surface-container">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center font-bold hover:bg-primary hover:text-on-primary transition-colors text-xs"
                        >
                          -
                        </button>
                        <span className="font-bold text-xs text-on-surface min-w-[14px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center font-bold hover:bg-primary hover:text-on-primary transition-colors text-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <span className="font-headline-md text-sm font-bold text-on-surface">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-secondary hover:text-error transition-colors p-1"
                        title="Remove item"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address & Notes Card */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-variant flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">pin_drop</span>
                <h2 className="font-headline-sm text-base font-bold text-on-surface">Delivery Address & Instructions</h2>
              </div>

              <div>
                <label className="font-label-md text-xs font-semibold text-secondary block mb-1">
                  Full Neighbourhood Address
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Apartment, flat or house number, street name, landmarks..."
                  className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm text-on-surface outline-none focus:border-primary focus:bg-surface-container-lowest resize-none"
                  required
                />
              </div>

              <div>
                <label className="font-label-md text-xs font-semibold text-secondary block mb-1">
                  Special Notes for Shopkeeper (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Leave by door, ring buzzer twice, swing over ASAP!"
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface outline-none focus:border-primary focus:bg-surface-container-lowest"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Action */}
          <div className="flex flex-col gap-4">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant shadow-xs flex flex-col gap-4 sticky top-24">
              <h3 className="font-headline-sm text-base font-bold text-on-surface border-b border-surface-container pb-3">
                Order Summary
              </h3>

              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between text-secondary">
                  <span>Item Subtotal ({totalCount} items)</span>
                  <span className="font-medium text-on-surface">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-secondary">
                  <span>Neighbourhood Delivery</span>
                  <span className="text-tertiary font-bold">FREE (Local Hero)</span>
                </div>
                <div className="flex items-center justify-between text-secondary">
                  <span>Platform Fee</span>
                  <span className="text-tertiary font-bold">₹0.00 (Zero Tax)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                <div>
                  <span className="text-xs text-secondary font-medium">To Pay</span>
                  <div className="font-headline-lg text-2xl font-bold text-primary">
                    ₹{subtotal.toFixed(2)}
                  </div>
                </div>
                <span className="text-[10px] bg-tertiary/10 text-tertiary font-bold px-2 py-0.5 rounded-full">
                  Cash on Delivery / UPI
                </span>
              </div>

              {!isAuthenticated && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                  Please log in or register before swinging your order over.
                </div>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full h-13 mt-2 bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Swinging it over...' : 'Swing it over!'}</span>
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </button>

              <div className="pt-2 text-center flex flex-col gap-1 text-[11px] text-secondary">
                <span className="flex items-center justify-center gap-1 text-tertiary font-medium">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Direct order to store counter
                </span>
                <span>Order creation and stock reservation occur in a single atomic transaction.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

