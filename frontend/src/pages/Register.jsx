import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Register() {
  const [role, setRole] = useState('customer'); // 'customer' or 'shop_owner'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('Kirana & Daily Essentials');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const user = await register({
        email,
        password,
        full_name: fullName,
        role,
        shop_name: role === 'shop_owner' ? shopName : undefined,
        shop_address: address,
        shop_category: role === 'shop_owner' ? category : undefined,
      });

      if (user.role === 'shop_owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-10 px-4 min-h-[calc(100vh-140px)] bg-background">
      <div className="w-full max-w-[520px] bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-variant p-6 sm:p-10 flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
            <span className="material-symbols-outlined text-[28px]">
              {role === 'customer' ? 'person_add' : 'store'}
            </span>
          </div>
          <h1 className="font-headline-md text-2xl font-bold text-on-surface tracking-tight mb-1">
            Create your Local Hai account
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-secondary">
            Join the neighbourhood-first network. Zero dark stores, 100% community.
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex p-1 bg-surface-container rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              role === 'customer'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span>Customer (Resident)</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('shop_owner')}
            className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              role === 'shop_owner'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>Shopkeeper (Merchant)</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-error-container/40 border border-error/20 text-error text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-xs font-semibold text-on-surface">
              {role === 'shop_owner' ? 'Shopkeeper Full Name' : 'Your Full Name'}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={role === 'shop_owner' ? 'e.g. Ramesh Gupta' : 'e.g. Peter Parker'}
              className="w-full h-11 px-4 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-md text-sm outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
            />
          </div>

          {role === 'shop_owner' && (
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-xs font-semibold text-on-surface">
                Store / Kirana Name
              </label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Gupta Provision Store"
                className="w-full h-11 px-4 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-md text-sm outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-xs font-semibold text-on-surface">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@neighbourhood.in"
              className="w-full h-11 px-4 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-md text-sm outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-xs font-semibold text-on-surface">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full h-11 px-4 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-md text-sm outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-xs font-semibold text-on-surface">
              {role === 'shop_owner' ? 'Store Physical Address' : 'Delivery Address'}
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={role === 'shop_owner' ? 'Shop #, Cross Road, Indiranagar' : 'Apartment, Street name, Area'}
              className="w-full h-11 px-4 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-md text-sm outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
            />
          </div>

          {role === 'shop_owner' && (
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-xs font-semibold text-on-surface">Store Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-md text-sm outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
              >
                <option value="Kirana & Daily Essentials">Kirana & Daily Essentials</option>
                <option value="Fresh Fruits & Veggies">Fresh Fruits & Veggies</option>
                <option value="Bakery & Savouries">Bakery & Savouries</option>
                <option value="Dairy & Poultry">Dairy & Poultry</option>
                <option value="Stationery & General">Stationery & General</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 mt-3 bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Weaving your spot...' : (role === 'shop_owner' ? 'Open My Digital Storefront' : 'Spin Into Local Hai')}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        <div className="text-center pt-6 mt-6 border-t border-surface-container">
          <p className="font-body-md text-xs text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-label-md text-primary font-bold hover:underline ml-1">
              Suit up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

