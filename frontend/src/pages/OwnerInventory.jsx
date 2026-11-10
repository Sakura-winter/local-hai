import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getOwnerShopsApi,
  getOwnerProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi
} from '../api';

export function OwnerInventory() {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Flours & Grains');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formUnit, setFormUnit] = useState('1 Pack');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  const loadInventory = async () => {
    setLoading(true);
    try {
      const shops = await getOwnerShopsApi();
      const currentShop = shops[0] || { id: 1, name: 'Lakshmi Provision Store' };
      setShop(currentShop);

      const prods = await getOwnerProductsApi(currentShop.id);
      setProducts(prods);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Flours & Grains');
    setFormPrice('');
    setFormStock('');
    setFormUnit('1 Pack');
    setFormDescription('');
    setFormImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category || 'Flours & Grains');
    setFormPrice(String(prod.price));
    setFormStock(String(prod.stock));
    setFormUnit(prod.unit || '1 Pack');
    setFormDescription(prod.description || '');
    setFormImageUrl(prod.image_url || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        shop_id: shop?.id || 1,
        name: formName,
        category: formCategory,
        price: parseFloat(formPrice),
        stock: parseInt(formStock, 10),
        unit: formUnit,
        description: formDescription,
        image_url: formImageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80'
      };

      if (editingProduct) {
        await updateProductApi(editingProduct.id, payload);
      } else {
        await createProductApi(payload);
      }

      setIsModalOpen(false);
      await loadInventory();
    } catch (err) {
      alert(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to remove "${productName || 'this item'}" from your store counter?`)) return;
    try {
      await deleteProductApi(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      alert(err.message || 'Failed to remove product.');
    }
  };

  const handleToggleAvailability = async (productId, currentStatus) => {
    try {
      await updateProductApi(productId, { is_available: !currentStatus });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, is_available: !currentStatus } : p));
    } catch (err) {
      alert(err.message || 'Failed to update visibility.');
    }
  };

  const handleStockQuickChange = async (productId, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await updateProductApi(productId, { stock: newStock });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full min-h-screen bg-background pb-16">
      {/* Top Banner Header */}
      <div className="bg-surface-container-lowest border-b border-surface-variant py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-secondary mb-2">
              <Link to="/owner/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                <span>The Daily Bugle</span>
              </Link>
              <span>/</span>
              <span className="text-on-surface font-semibold">Inventory Control</span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">
              Store Inventory & Pricing
            </h1>
            <p className="font-body-sm text-xs text-secondary mt-1">
              Manage stock, counter rates, and product listings for {shop?.name || 'your store'}
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold flex items-center gap-2 transition-all shadow-xs self-start md:self-auto"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar & count */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product name, category..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-secondary">
            <span>{filteredProducts.length} Products in catalogue</span>
            <span className="text-surface-variant">•</span>
            <span className="text-tertiary">
              {filteredProducts.filter(p => p.stock > 0).length} In Stock
            </span>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-secondary text-xs">
              <span className="material-symbols-outlined animate-spin text-[32px] text-primary mb-2">progress_activity</span>
              <div>Loading inventory catalog...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-secondary">
              <span className="material-symbols-outlined text-[48px] text-secondary/60 mb-2">inventory_2</span>
              <p className="font-headline-sm text-base font-bold text-on-surface">No products found.</p>
              <button
                type="button"
                onClick={openAddModal}
                className="mt-3 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold"
              >
                + Add your first product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/70 border-b border-surface-container text-[11px] font-bold text-secondary uppercase tracking-wider">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (₹)</th>
                    <th className="py-3 px-4">Stock Level</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container text-xs">
                  {filteredProducts.map(prod => {
                    const isLowStock = prod.stock > 0 && prod.stock <= 15;
                    const isOutOfStock = prod.stock === 0;

                    return (
                      <tr key={prod.id} className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image_url}
                              alt={prod.name}
                              className="w-12 h-12 rounded-xl object-cover bg-surface-container shrink-0"
                            />
                            <div>
                              <div className="font-bold text-on-surface text-sm line-clamp-1">{prod.name}</div>
                              <div className="text-[11px] text-secondary line-clamp-1">
                                {prod.description || prod.unit || 'Standard'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-secondary">
                          <span className="px-2.5 py-1 rounded-lg bg-surface-container text-[11px]">
                            {prod.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-headline-md text-sm font-bold text-on-surface">
                            ₹{prod.price}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-surface-container-low rounded-lg border border-surface-container px-1 py-0.5">
                              <button
                                type="button"
                                onClick={() => handleStockQuickChange(prod.id, prod.stock, -1)}
                                className="w-5 h-5 rounded hover:bg-surface-container text-secondary font-bold flex items-center justify-center text-xs"
                              >
                                -
                              </button>
                              <span className="px-2 font-bold text-on-surface min-w-[28px] text-center">
                                {prod.stock}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleStockQuickChange(prod.id, prod.stock, 1)}
                                className="w-5 h-5 rounded hover:bg-surface-container text-secondary font-bold flex items-center justify-center text-xs"
                              >
                                +
                              </button>
                            </div>

                            {isOutOfStock && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                                Out of Stock
                              </span>
                            )}
                            {isLowStock && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                Low Stock
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                            prod.is_available && prod.stock > 0 ? 'text-tertiary' : 'text-secondary'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              prod.is_available && prod.stock > 0 ? 'bg-tertiary' : 'bg-secondary'
                            }`}></span>
                            {prod.is_available && prod.stock > 0 ? 'Live on app' : 'Hidden / Out'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleAvailability(prod.id, prod.is_available)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                prod.is_available
                                  ? 'text-tertiary hover:bg-tertiary/10'
                                  : 'text-secondary/50 hover:bg-surface-container'
                              }`}
                              title={prod.is_available ? 'Hide item from customer store counter' : 'Show item on customer store counter'}
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                {prod.is_available ? 'visibility' : 'visibility_off'}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditModal(prod)}
                              className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-container transition-colors"
                              title="Edit product"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(prod.id, prod.name)}
                              className="p-1.5 rounded-lg text-error/70 hover:text-error hover:bg-error-container transition-colors"
                              title="Remove product"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-surface-variant flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-surface-container">
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                {editingProduct ? 'Edit Product' : 'Add New Counter Product'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-secondary hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-secondary">Product Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Aashirvaad Shudh Chakki Atta"
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-secondary">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-10 px-2 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface outline-none focus:border-primary"
                  >
                    <option value="Flours & Grains">Flours & Grains</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Oils & Ghee">Oils & Ghee</option>
                    <option value="Salt & Spices">Salt & Spices</option>
                    <option value="Instant Food">Instant Food</option>
                    <option value="Tea & Beverages">Tea & Beverages</option>
                    <option value="Household & Cleaning">Household & Cleaning</option>
                    <option value="Fresh Produce">Fresh Produce</option>
                    <option value="Fresh Fruits">Fresh Fruits</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Snacks">Snacks</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-secondary">Unit / Pack Size</label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="e.g. 5 kg or 1 L"
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-secondary">Counter Price (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="245"
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-secondary">Initial Stock (Units)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="25"
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-secondary">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Key details, origin, or freshness notes..."
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-secondary">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-surface-container text-xs font-bold text-secondary hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving to Counter...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

