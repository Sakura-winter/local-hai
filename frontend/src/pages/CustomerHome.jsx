import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getShopsApi, getShopProductsApi } from '../api';
import { useCart } from '../context/CartContext';

export function CustomerHome() {
  const [shops, setShops] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const { addToCart, getItemQuantity, updateQuantity } = useCart();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const shopsData = await getShopsApi();
        setShops(shopsData);

        // Fetch sample products from shop #1 for the popular section
        if (shopsData.length > 0) {
          const prods = await getShopProductsApi(shopsData[0].id);
          setPopularProducts(prods.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load marketplace data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = ['All', 'Kirana & Daily Essentials', 'Fresh Fruits & Veggies', 'Bakery & Savouries', 'Dairy'];

  const filteredShops = shops.filter(shop => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === 'All' ||
      shop.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full min-h-screen bg-background pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface-container-low/40 to-background border-b border-surface-variant/60 py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Zero Dark-Stores • 100% Local Community</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-on-surface tracking-tight max-w-3xl leading-tight mb-4">
            Your friendly neighbourhood local store.
          </h1>

          <p className="font-body-lg text-base sm:text-lg text-secondary max-w-2xl mb-8 leading-relaxed">
            The heroes were your local shopkeepers all along. Skip the warehouse apps—order fresh groceries, milk, and daily essentials straight from your trusted neighbourhood kiranas.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-md border border-surface-variant p-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary ml-3 text-[22px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by store name, staples, atta, milk, biscuits..."
              className="w-full py-2.5 px-2 bg-transparent text-on-surface font-body-md text-sm sm:text-base outline-none placeholder:text-secondary/60"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-secondary hover:bg-surface-container mr-1"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-bold transition-all shrink-0"
            >
              Search
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-4 mt-4 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary border-primary shadow-xs'
                    : 'bg-surface-container-lowest text-secondary border-surface-container hover:bg-surface-container-low'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-variant flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">store</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-sm font-bold text-on-surface">Direct from Counter</h3>
              <p className="font-body-sm text-xs text-secondary mt-0.5">Real kiranas you've known for decades, not faceless dark warehouses.</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-variant flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">bolt</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-sm font-bold text-on-surface">15-25 Mins Swing</h3>
              <p className="font-body-sm text-xs text-secondary mt-0.5">Hyperlocal proximity means your orders arrive hot and fresh instantly.</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-variant flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">shield_check</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-sm font-bold text-on-surface">Community First</h3>
              <p className="font-body-sm text-xs text-secondary mt-0.5">Zero predatory commissions. Every rupee supports your local merchant.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Shops Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
              Neighbourhood Stores Near You
            </h2>
            <p className="font-body-md text-xs sm:text-sm text-secondary mt-1">
              Hand-picked verified shops serving Indiranagar and nearby pockets
            </p>
          </div>
          <span className="text-xs font-semibold text-secondary">
            {filteredShops.length} {filteredShops.length === 1 ? 'store' : 'stores'} found
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-surface-container-lowest rounded-2xl h-80 animate-pulse border border-surface-variant"></div>
            ))}
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-dashed border-surface-variant flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[48px] text-secondary/60 mb-2">radar</span>
            <h3 className="font-headline-md text-lg font-bold text-on-surface">No heroes spotted in this neighbourhood yet.</h3>
            <p className="font-body-md text-sm text-secondary mt-1">Try searching for a different item or clear your active category filters.</p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <Link
                key={shop.id}
                to={`/shop/${shop.id}`}
                className="group bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all flex flex-col"
              >
                {/* Shop Cover Banner */}
                <div className="relative h-44 w-full bg-surface-container overflow-hidden">
                  <img
                    src={shop.banner_url || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80"}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">local_police</span>
                    <span>{shop.badge || "Verified Kirana"}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-tertiary text-on-tertiary px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span>Open Now</span>
                  </div>
                </div>

                {/* Shop Info */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-headline-md text-lg font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
                      {shop.name}
                    </h3>
                  </div>

                  <p className="font-body-sm text-xs text-secondary line-clamp-2 mb-3">
                    {shop.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-secondary mb-3">
                    <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                    <span className="truncate">{shop.address}</span>
                  </div>

                  <div className="mt-auto pt-3 border-t border-surface-container flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-bold text-on-surface">
                        <span className="material-symbols-outlined text-[16px] text-amber-500 fill-1">star</span>
                        {shop.rating || "4.8"}
                      </span>
                      <span className="text-secondary font-medium">•</span>
                      <span className="text-secondary flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {shop.delivery_time || "15-25 mins"}
                      </span>
                    </div>

                    <span className="font-label-md text-primary font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      <span>Visit</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Popular Items from Local Heroes */}
      {popularProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
                Popular items from nearby stores
              </h2>
              <p className="font-body-md text-xs sm:text-sm text-secondary mt-1">
                Freshly stocked neighbourhood favourites ready to swing over
              </p>
            </div>
            <Link to="/shop/1" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              <span>View full counter</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularProducts.map((prod) => {
              const qty = getItemQuantity(prod.id);
              const parentShop = shops.find(s => s.id === prod.shop_id) || shops[0];

              return (
                <div
                  key={prod.id}
                  className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-4 flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div className="relative h-40 rounded-xl overflow-hidden bg-surface-container mb-3">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-surface-container-lowest/90 px-2 py-0.5 rounded-md text-[10px] font-semibold text-secondary">
                      {prod.category}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-headline-sm text-sm font-bold text-on-surface line-clamp-2 mb-1">
                      {prod.name}
                    </h4>
                    <p className="font-body-sm text-xs text-secondary mb-3">
                      {prod.unit || 'Standard Pack'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                    <div>
                      <span className="text-[11px] text-secondary">Price</span>
                      <div className="font-headline-md text-base font-bold text-on-surface">
                        ₹{prod.price}
                      </div>
                    </div>

                    {qty > 0 ? (
                      <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(prod.id, qty - 1)}
                          className="w-6 h-6 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center font-bold hover:bg-primary hover:text-on-primary transition-colors"
                        >
                          -
                        </button>
                        <span className="font-bold text-xs text-primary min-w-[14px] text-center">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(prod.id, qty + 1)}
                          className="w-6 h-6 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center font-bold hover:bg-primary hover:text-on-primary transition-colors"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addToCart(prod, parentShop)}
                        className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                        <span>Add to web</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

