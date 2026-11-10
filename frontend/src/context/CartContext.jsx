import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartState, setCartState] = useState(() => {
    try {
      const saved = localStorage.getItem('localhai_cart');
      return saved ? JSON.parse(saved) : { shop: null, items: [] };
    } catch {
      return { shop: null, items: [] };
    }
  });

  const [shopConflictModal, setShopConflictModal] = useState(null);

  useEffect(() => {
    localStorage.setItem('localhai_cart', JSON.stringify(cartState));
  }, [cartState]);

  const addToCart = (product, shop) => {
    // Check single-shop constraint
    if (cartState.shop && cartState.items.length > 0 && String(cartState.shop.id) !== String(shop.id)) {
      // Conflict: item from another store
      setShopConflictModal({
        pendingProduct: product,
        pendingShop: shop,
        currentShop: cartState.shop
      });
      return false;
    }

    setCartState(prev => {
      const existingIdx = prev.items.findIndex(i => String(i.id) === String(product.id));
      let updatedItems;

      if (existingIdx > -1) {
        updatedItems = prev.items.map((item, idx) =>
          idx === existingIdx
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock || 99) }
            : item
        );
      } else {
        updatedItems = [
          ...prev.items,
          {
            id: product.id,
            name: product.name,
            unit: product.unit || '',
            price: Number(product.price),
            stock: product.stock,
            image_url: product.image_url,
            category: product.category,
            quantity: 1
          }
        ];
      }

      return {
        shop: prev.shop || { id: shop.id, name: shop.name, address: shop.address },
        items: updatedItems
      };
    });

    return true;
  };

  const resolveConflict = (replace = false) => {
    if (replace && shopConflictModal) {
      const { pendingProduct, pendingShop } = shopConflictModal;
      setCartState({
        shop: { id: pendingShop.id, name: pendingShop.name, address: pendingShop.address },
        items: [{
          id: pendingProduct.id,
          name: pendingProduct.name,
          unit: pendingProduct.unit || '',
          price: Number(pendingProduct.price),
          stock: pendingProduct.stock,
          image_url: pendingProduct.image_url,
          category: pendingProduct.category,
          quantity: 1
        }]
      });
    }
    setShopConflictModal(null);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartState(prev => {
      const updated = prev.items.map(item => {
        if (String(item.id) === String(productId)) {
          const maxStock = item.stock || 99;
          return { ...item, quantity: Math.min(newQuantity, maxStock) };
        }
        return item;
      });
      return { ...prev, items: updated };
    });
  };

  const removeFromCart = (productId) => {
    setCartState(prev => {
      const updated = prev.items.filter(item => String(item.id) !== String(productId));
      return {
        shop: updated.length === 0 ? null : prev.shop,
        items: updated
      };
    });
  };

  const clearCart = () => {
    setCartState({ shop: null, items: [] });
  };

  const getItemQuantity = (productId) => {
    const item = cartState.items.find(i => String(i.id) === String(productId));
    return item ? item.quantity : 0;
  };

  const totalCount = cartState.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = Number(
    cartState.items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)
  );

  const value = {
    cart: cartState,
    shop: cartState.shop,
    items: cartState.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    totalCount,
    subtotal,
    shopConflictModal,
    resolveConflict
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Shop Conflict Modal */}
      {shopConflictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 shadow-xl border border-surface-variant flex flex-col gap-4">
            <div className="flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined text-[32px]">swap_horizontal_circle</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Replace cart items?</h3>
            </div>
            <p className="font-body-md text-secondary">
              Your web currently has items from <strong className="text-on-surface">{shopConflictModal.currentShop.name}</strong>.
              A Local Hai order can only swing by <span className="font-semibold text-primary">one store</span> at a time.
            </p>
            <p className="font-body-sm text-secondary">
              Would you like to clear your current web and start a fresh order from <strong className="text-on-surface">{shopConflictModal.pendingShop.name}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => resolveConflict(false)}
                className="px-4 py-2.5 rounded-xl border border-secondary/20 hover:bg-surface-container font-label-md text-on-surface transition-colors"
              >
                Keep current web
              </button>
              <button
                type="button"
                onClick={() => resolveConflict(true)}
                className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md transition-colors"
              >
                Clear & switch shop
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

