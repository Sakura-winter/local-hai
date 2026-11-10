import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const loggedUser = await login(email, password);
      if (redirectPath) {
        navigate(redirectPath);
      } else if (loggedUser.role === 'shop_owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Failed to swing into your account. Check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (role) => {
    const creds = role === 'shop_owner'
      ? { email: 'guptastores@localhai.in', pass: 'KiranaPass2025' }
      : { email: 'resident@localhai.in', pass: 'Neighbourhood2025' };
    
    setEmail(creds.email);
    setPassword(creds.pass);
    setError('');
    setIsSubmitting(true);
    try {
      const user = await login(creds.email, creds.pass);
      if (user.role === 'shop_owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Fallback to local demo if backend is offline
      const user = quickDemoLogin(role);
      if (user.role === 'shop_owner') navigate('/owner/dashboard');
      else navigate('/');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-12 px-4 min-h-[calc(100vh-140px)] bg-background">
      <div className="flex flex-col w-full items-center justify-center">
        <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-variant p-8 sm:p-10 flex flex-col relative">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary mb-3">
              <span className="material-symbols-outlined text-[28px]">storefront</span>
            </div>
            <h1 className="font-headline-md text-2xl font-bold text-on-surface tracking-tight mb-1">
              Suit up
            </h1>
            <p className="font-body-md text-sm text-secondary">
              The heroes were your local shopkeepers all along. Welcome to the neighbourhood-verse.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-error-container/40 border border-error/20 text-error text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-xs font-semibold text-on-surface" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="resident@localhai.in"
                  required
                  className="w-full h-11 px-4 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-md text-sm placeholder:text-secondary/60 outline-none transition-all focus:border-primary focus:bg-surface-container-lowest"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-xs font-semibold text-on-surface" htmlFor="password">
                  Password
                </label>
                <span className="font-label-sm text-xs text-secondary">
                  Secret key
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 pl-4 pr-11 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-md text-sm placeholder:text-secondary/60 outline-none transition-all focus:border-primary focus:bg-surface-container-lowest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 text-secondary hover:text-on-surface transition-colors p-1 flex items-center justify-center rounded-lg"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-primary border-surface-container focus:ring-primary"
                />
                <span className="font-body-sm text-xs text-secondary">Keep me signed in</span>
              </label>
              <span className="font-label-sm text-[11px] text-tertiary flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                256-bit encrypted
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 mt-2 bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Swinging in...' : 'Swing in'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full h-[1px] bg-surface-container"></div>
            <span className="absolute bg-surface-container-lowest px-3 font-label-sm text-[11px] text-secondary uppercase tracking-wider font-semibold">
              or quick demo access
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="flex items-center justify-start gap-2.5 py-2.5 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface transition-all group text-left border border-surface-container"
            >
              <span className="material-symbols-outlined text-[22px] text-primary group-hover:scale-110 transition-transform">
                shopping_bag
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-xs font-bold leading-none truncate">Customer</span>
                <span className="font-body-sm text-[10px] text-secondary leading-tight mt-1 truncate">Peter Parker</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('shop_owner')}
              className="flex items-center justify-start gap-2.5 py-2.5 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface transition-all group text-left border border-surface-container"
            >
              <span className="material-symbols-outlined text-[22px] text-tertiary group-hover:scale-110 transition-transform">
                storefront
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-xs font-bold leading-none truncate">Shopkeeper</span>
                <span className="font-body-sm text-[10px] text-secondary leading-tight mt-1 truncate">Ramesh Gupta</span>
              </div>
            </button>
          </div>

          {/* Link to Register */}
          <div className="text-center pt-2 border-t border-surface-container">
            <p className="font-body-md text-xs text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="font-label-md text-primary font-bold hover:underline ml-1">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

