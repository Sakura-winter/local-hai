import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { USE_MOCK } from '../api/client';

export function Navbar() {
  const { user, isAuthenticated, logout, isOwner } = useAuth();
  const { totalCount, shop } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest/95 backdrop-blur-md border-b border-surface-variant transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <Link to={isOwner ? "/owner/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[26px]">storefront</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight leading-tight">
                Local Hai
              </span>
              <span className="font-label-sm text-[10px] text-secondary tracking-wide uppercase">
                {isOwner ? "Daily Bugle • Merchant Portal" : "Neighbourhood Bazaar"}
              </span>
            </div>
          </Link>

          {/* Location Chip (for customers) */}
          {!isOwner && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface border border-surface-container text-xs font-medium">
              <span className="material-symbols-outlined text-[16px] text-primary">near_me</span>
              <span>Indiranagar, Bengaluru</span>
              <span className="text-[10px] bg-tertiary/10 text-tertiary font-semibold px-1.5 py-0.5 rounded-full">Active</span>
            </div>
          )}
        </div>

        {/* Navigation Links based on role */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mock status pill */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-[11px] font-medium text-secondary">
            <span className={`w-2 h-2 rounded-full ${USE_MOCK ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
            <span>{USE_MOCK ? 'Demo Mode (Mock)' : 'Live API'}</span>
          </div>

          {isOwner ? (
            /* Shop Owner Navigation */
            <div className="flex items-center gap-2">
              <Link
                to="/owner/dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  location.pathname === '/owner/dashboard'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">newspaper</span>
                <span className="hidden sm:inline">The Daily Bugle</span>
              </Link>

              <Link
                to="/owner/inventory"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  location.pathname === '/owner/inventory'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                <span className="hidden sm:inline">Inventory</span>
              </Link>

              <Link
                to="/owner/orders"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  location.pathname === '/owner/orders'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">list_alt</span>
                <span className="hidden sm:inline">Orders</span>
              </Link>
            </div>
          ) : (
            /* Customer Navigation */
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  location.pathname === '/'
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">explore</span>
                <span className="hidden sm:inline">Browse Shops</span>
              </Link>

              {isAuthenticated && (
                <Link
                  to="/orders"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    location.pathname === '/orders'
                      ? 'bg-primary/10 text-primary'
                      : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  <span className="hidden sm:inline">My Orders</span>
                </Link>
              )}

              {/* Cart / Web Button */}
              <Link
                to="/cart"
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-primary-container hover:text-on-primary text-on-surface font-semibold text-sm transition-all"
                title="Your Web (Cart)"
              >
                <span className="material-symbols-outlined text-[20px] text-primary">shopping_bag</span>
                <span className="hidden sm:inline">Web</span>
                {totalCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-primary text-on-primary text-xs font-bold animate-bounce">
                    {totalCount}
                  </span>
                )}
              </Link>
            </div>
          )}

          {/* User Profile / Auth State */}
          <div className="flex items-center gap-2 pl-2 border-l border-surface-variant">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="font-label-md text-xs font-bold text-on-surface leading-tight">
                    {user?.full_name || user?.email}
                  </span>
                  <span className="font-body-sm text-[10px] text-secondary capitalize">
                    {user?.role === 'shop_owner' ? 'Shopkeeper' : 'Neighbourhood Resident'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant/60 hover:bg-error-container hover:text-on-error-container text-secondary text-xs font-semibold transition-colors"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span className="hidden sm:inline">Swing away</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl border border-primary text-primary hover:bg-primary/10 font-label-md text-sm font-semibold transition-colors"
                >
                  Suit up
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-semibold transition-colors shadow-xs"
                >
                  Join Bazaar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

