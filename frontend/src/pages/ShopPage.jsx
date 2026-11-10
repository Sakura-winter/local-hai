import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getShopApi, getShopProductsApi } from '../api';
import { useCart } from '../context/CartContext';

export function ShopPage() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { addToCart, getItemQuantity, updateQuantity, totalCount, subtotal, shop: cartShop } = useCart();

  useEffect(() => {
    async function loadShopAndProducts() {
      setLoading(true);
      try {
        const shopData = await getShopApi(id);
        setShop(shopData);
        const prods = await getShopProductsApi(id);
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load shop:', err);
      } finally {
        setLoading(false);
      }
    }
    loadShopAndProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined animate-spin text-[36px] text-primary">progress_activity</span>
        <p className="font-body-md text-secondary">Spinning the web to load shop counter...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-surface-container-lowest rounded-2xl border border-surface-variant">
        <span className="material-symbols-outlined text-[48px] text-error mb-2">store_off</span>
        <h2 className="font-headline-md text-xl font-bold text-on-surface">Store Not Found</h2>
        <p className="font-body-md text-sm text-secondary mt-1">This kirana might have swung to a different neighbourhood.</p>
        <Link to="/" className="inline-block mt-4 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold">
          Back to Bazaar
        </Link>
      </div>
    );
  }

  // Derive unique categories
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCat =
      selectedCategory === 'All' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full min-h-screen bg-background pb-28">
      {/* Store Banner & Meta Header */}
      <div className="w-full bg-surface-container-lowest border-b border-surface-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-secondary mb-4">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              <span>All Neighbourhood Kiranas</span>
            </Link>
            <span>/</span>
            <span className="text-on-surface font-medium truncate">{shop.name}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                <img
                  src={shop.banner_url || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&auto=format&fit=crop&q=80"}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">
                    {shop.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold border border-tertiary/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    Open Now
                  </span>
                </div>

                <p className="font-body-md text-xs sm:text-sm text-secondary max-w-2xl mb-2">
                  {shop.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-secondary">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                    <span>{shop.address}</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-amber-500 fill-1">star</span>
                    <span>{shop.rating || "4.8"}</span>
                    <span className="text-secondary font-normal">({shop.reviews_count || 1200}+ reviews)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    <span>{shop.delivery_time || "15-25 mins"}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-2xl border border-surface-container shrink-0 self-stretch md:self-auto flex md:flex-col justify-between items-center gap-2 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Zero Dark-Store</span>
              <span className="text-xs text-secondary font-medium">100% Counter Direct</span>
            </div>
          </div>
        </div>
      </div>

      {/* Counter Controls: Search & Category Filter */}
      <div className="sticky top-18 z-30 bg-surface-container-lowest/95 backdrop-blur-md border-b border-surface-variant py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low hover:bg-surface-container text-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search within this shop */}
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items in this shop..."
              className="w-full h-9 pl-9 pr-8 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface outline-none focus:border-primary"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Counter Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline-md text-xl font-bold text-on-surface">
            Available at Store Counter
          </h2>
          <span className="text-xs text-secondary font-medium">
            {filteredProducts.length} items
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-dashed border-surface-variant flex flex-col items-center">
            <span className="material-symbols-outlined text-[44px] text-secondary/60 mb-2">search_off</span>
            <h3 className="font-headline-sm text-base font-bold text-on-surface">No products matched your search.</h3>
            <p className="font-body-md text-xs text-secondary mt-1">Try another keyword or select "All" categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(prod => {
              const qty = getItemQuantity(prod.id);
              const inStock = prod.stock > 0;

              return (
                <div
                  key={prod.id}
                  className="bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden hover:shadow-md transition-all flex flex-col p-4 justify-between"
                >
                  <div>
                    <div className="relative h-44 rounded-xl overflow-hidden bg-surface-container mb-3">
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-surface-container-lowest/90 px-2 py-0.5 rounded-md text-[10px] font-semibold text-secondary">
                        {prod.category}
                      </div>
                      {!inStock && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center">
                          <span className="px-3 py-1 rounded-full bg-error text-on-error text-xs font-bold uppercase tracking-wider">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-headline-sm text-sm font-bold text-on-surface line-clamp-2 mb-1">
                      {prod.name}
                    </h3>
                    <p className="font-body-sm text-xs text-secondary line-clamp-2 mb-2">
                      {prod.description}
                    </p>
                    <span className="inline-block text-[11px] font-medium text-secondary/80 bg-surface-container-low px-2 py-0.5 rounded-md mb-3">
                      {prod.unit || 'Standard Pack'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-secondary font-medium">Counter Price</span>
                      <div className="font-headline-md text-base font-bold text-on-surface">
                        ₹{prod.price}
                      </div>
                      <span className="text-[10px] text-tertiary font-semibold">
                        {inStock ? `${prod.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    {inStock && (
                      qty > 0 ? (
                        <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-2 py-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(prod.id, qty - 1)}
                            className="w-7 h-7 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center font-bold hover:bg-primary hover:text-on-primary transition-colors"
                          >
                            -
                          </button>
                          <span className="font-bold text-sm text-primary min-w-[16px] text-center">{qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(prod.id, qty + 1)}
                            className="w-7 h-7 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center font-bold hover:bg-primary hover:text-on-primary transition-colors"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(prod, shop)}
                          className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                          <span>Add to web</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar (if items in cart) */}
      {totalCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-3xl mx-auto z-40 bg-on-surface text-surface rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4 border border-surface-variant/20 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-surface-variant">
                Your Web ({totalCount} {totalCount === 1 ? 'item' : 'items'})
                {cartShop && <span className="ml-1 text-primary-fixed">• {cartShop.name}</span>}
              </div>
              <div className="font-headline-md text-base font-bold text-white">
                ₹{subtotal}
              </div>
            </div>
          </div>

          <Link
            to="/cart"
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <span>Swing to Checkout</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      )}
    </div>
  );
}

