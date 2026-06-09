'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Sparkles, AlertCircle, Check } from 'lucide-react';
import { Product } from '@/types';
import { createProduct, updateProduct, deleteProduct } from '@/services/api-products';
import { CATEGORY_MAINS, CATEGORY_DRINKS, CATEGORY_DESSERTS, CATEGORY_MERCH } from '@/constants';
import { ProductImageOrEmoji } from '@/components/ui/ProductImageOrEmoji';
import { DeleteProductConfirmModal } from '@/components/ui/modal/DeleteProductConfirmModal';
import { Select } from '@/components/ui/Select';

interface ProductDetailClientProps {
  product: Product | null; // null if creating a new product
  isNew: boolean;
  categories: string[];
  isModal?: boolean;
}

export function ProductDetailClient({ product, isNew, categories = [], isModal = false }: Readonly<ProductDetailClientProps>) {
  const router = useRouter();
  
  // Local state for the product form fields
  const [name, setName] = useState(product?.name || '');
  const [emoji, setEmoji] = useState(product?.emoji || '🌸');
  const [category, setCategory] = useState(product?.category || CATEGORY_MAINS);
  const [price, setPrice] = useState(product?.price?.toString() || '0.00');
  const [description, setDescription] = useState(product?.description || '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity?.toString() || '0');
  const [costPrice, setCostPrice] = useState(product?.costPrice?.toString() || '0.00');
  const [lowStockThreshold, setLowStockThreshold] = useState(product?.lowStockThreshold?.toString() || '5');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isFormInvalid = !name.trim() || !emoji.trim() || !price.toString().trim() || !costPrice.toString().trim() || !stockQuantity.toString().trim() || !lowStockThreshold.toString().trim();

  const categoriesList = categories.length > 0 ? categories : [CATEGORY_MAINS, CATEGORY_DRINKS, CATEGORY_DESSERTS, CATEGORY_MERCH];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Basic validation
    if (!name.trim()) {
      setErrorMsg('Product name is required, nya!');
      setIsLoading(false);
      return;
    }
    if (!emoji.trim()) {
      setErrorMsg('Product emoji is required, nya!');
      setIsLoading(false);
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMsg('Please enter a valid price, nya!');
      setIsLoading(false);
      return;
    }

    const parsedCost = parseFloat(costPrice);
    if (isNaN(parsedCost) || parsedCost < 0) {
      setErrorMsg('Please enter a valid capital price, nya!');
      setIsLoading(false);
      return;
    }

    const parsedStock = parseInt(stockQuantity, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      setErrorMsg('Please enter a valid stock count, nya!');
      setIsLoading(false);
      return;
    }

    const parsedThreshold = parseInt(lowStockThreshold, 10);
    if (isNaN(parsedThreshold) || parsedThreshold < 0) {
      setErrorMsg('Please enter a valid low stock threshold, nya!');
      setIsLoading(false);
      return;
    }

    const productPayload = {
      name: name.trim(),
      emoji: emoji.trim(),
      category,
      price: parsedPrice,
      costPrice: parsedCost,
      description: description.trim(),
      imageUrl: imageUrl.trim() || null,
      stockQuantity: parsedStock,
      lowStockThreshold: parsedThreshold,
    };

    try {
      if (isNew) {
        const response = await createProduct(productPayload);
        if (response.success) {
          setSuccessMsg('Product created successfully! Redirecting...');
          setTimeout(() => {
            router.push('/stock');
            router.refresh();
          }, 1500);
        } else {
          setErrorMsg(response.message || 'Failed to create product.');
        }
      } else {
        if (!product?.id) return;
        const response = await updateProduct(product.id, productPayload);
        if (response.success) {
          setSuccessMsg('Product updated successfully!');
          setTimeout(() => {
            router.push('/stock');
            router.refresh();
          }, 1000);
        } else {
          setErrorMsg(response.message || 'Failed to update product.');
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!product?.id || isNew) return;

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await deleteProduct(product.id);
      if (response.success) {
        setSuccessMsg('Product deleted successfully! Redirecting...');
        setShowDeleteModal(false);
        setTimeout(() => {
          router.push('/stock');
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(response.message || 'Failed to delete product.');
        setShowDeleteModal(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'An error occurred during deletion.');
      setShowDeleteModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-theme-bg overflow-hidden select-none font-mono">
      {/* Title Bar */}
      <header className="h-16 px-6 border-b border-theme-border bg-theme-panel backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          {!isModal && (
            <button 
              type="button"
              onClick={() => router.push('/stock')}
              className="w-8 h-8 rounded-xl bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 cursor-pointer transition-all active:scale-95"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <h1 className="text-sm font-black text-zinc-200 tracking-wider uppercase">
            {isNew ? '✨ Summon New Product' : '🌸 Alter Product Catalog'}
          </h1>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col lg:flex-row gap-8 justify-center items-start max-w-7xl mx-auto w-full">
        
        {/* Left column: Edit Form */}
        <form onSubmit={handleSave} className="w-full lg:w-3/5 bg-theme-card border border-theme-border rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-5">
          <h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="text-theme-accent" size={14} /> Catalog Details
          </h2>

          {errorMsg && (
            <div className="flex items-center gap-2 bg-rose-950/20 border border-rose-900/30 text-rose-450 p-4 rounded-2xl text-xs">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 bg-emerald-950/20 border border-emerald-900/30 text-emerald-450 p-4 rounded-2xl text-xs">
              <Check size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Product Name <span className="text-pink-500 font-bold ml-0.5">*</span></label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Neko Parfait, Maid Latte..."
                className="h-10 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-200 focus:border-theme-accent outline-none transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Emoji */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Emoji Icon <span className="text-pink-500 font-bold ml-0.5">*</span></label>
              <input 
                type="text" 
                value={emoji} 
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={4}
                placeholder="🍧"
                className="h-10 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-200 focus:border-theme-accent outline-none text-center transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Category */}
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
              containerClassName="flex-grow"
              className="h-10"
            >
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>

            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Price ($ USD) <span className="text-pink-500 font-bold ml-0.5">*</span></label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
                className="h-10 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-200 focus:border-theme-accent outline-none transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Capital Cost */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Capital Price ($ USD) <span className="text-pink-500 font-bold ml-0.5">*</span></label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                value={costPrice} 
                onChange={(e) => setCostPrice(e.target.value)}
                className="h-10 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-200 focus:border-theme-accent outline-none transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Stock Quantity */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Stock Levels <span className="text-pink-500 font-bold ml-0.5">*</span></label>
              <input 
                type="number" 
                min="0"
                value={stockQuantity} 
                onChange={(e) => setStockQuantity(e.target.value)}
                className="h-10 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-200 focus:border-theme-accent outline-none transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Low Stock Threshold */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Low Stock Threshold <span className="text-pink-500 font-bold ml-0.5">*</span></label>
              <input 
                type="number" 
                min="0"
                value={lowStockThreshold} 
                onChange={(e) => setLowStockThreshold(e.target.value)}
                className="h-10 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-200 focus:border-theme-accent outline-none transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Image URL */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Image URL</label>
              <input 
                type="text" 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.png"
                className="h-10 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-200 focus:border-theme-accent outline-none transition-colors"
                disabled={isLoading}
              />
              <span className="text-[9px] text-zinc-550 font-bold mt-0.5">
                💡 Recommended size: 1:1 square ratio (e.g., 256x256 or 512x512 px) for matching visual alignments.
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter details, description, or ingredients..."
              rows={3}
              className="px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-200 focus:border-theme-accent outline-none resize-none transition-colors"
              disabled={isLoading}
            />
          </div>

          {/* Actions panel */}
          <div className="flex justify-between items-center border-t border-zinc-900 pt-5 mt-2 gap-3.5">
            {!isNew && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center gap-2 h-10 px-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-wider cursor-pointer transition-all active:scale-95 disabled:opacity-40"
                disabled={isLoading}
              >
                <Trash2 size={14} /> Delete
              </button>
            )}

            <div className="flex items-center gap-3.5 ml-auto">
              <button
                type="button"
                onClick={() => router.push('/stock')}
                className="h-10 px-5 rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200 text-xs font-black uppercase tracking-wider cursor-pointer transition-all active:scale-95 disabled:opacity-40"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 h-10 px-6 rounded-2xl bg-theme-accent text-white text-xs font-black uppercase tracking-wider cursor-pointer transition-all active:scale-95 shadow-[0_0_15px_rgba(244,63,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                disabled={isLoading || isFormInvalid}
              >
                <Save size={14} /> {isNew ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </form>

        {/* Right column: Card Preview */}
        <div className="w-full lg:w-2/5 flex flex-col gap-4 sticky top-6">
          <h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Live Hologram Preview</h2>
          
          <div className="border border-theme-border rounded-3xl p-6 bg-zinc-950/60 backdrop-blur flex flex-col items-center justify-center min-h-[300px]">
            {/* Themed POS Client menu card mockup */}
            <div 
              className="w-48 h-56 rounded-3xl border border-theme-border bg-theme-card shadow-2xl relative flex flex-col justify-between p-4 overflow-hidden group select-none transition-all duration-300"
            >
              {/* Highlight flare */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none -mr-8 -mt-8" />
              
              <div className="flex justify-between items-start">
                <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-lg border ${
                  category.toUpperCase() === 'MAINS' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                  category.toUpperCase() === 'DRINKS' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                  category.toUpperCase() === 'DESSERTS' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-purple-500/10 text-purple-400 border-purple-500/20'
                }`}>
                  {category}
                </span>
                
                <span 
                  className="text-xs font-black text-theme-accent font-mono"
                >
                  ${parseFloat(price || '0').toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center my-2 select-none">
                <div className="transform transition-transform group-hover:scale-110">
                  <ProductImageOrEmoji
                    imageUrl={imageUrl}
                    emoji={emoji}
                    name={name}
                    className="w-18 h-18 rounded-2xl bg-zinc-900/50 flex items-center justify-center overflow-hidden"
                    emojiClassName="text-5xl"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 select-none">
                <h3 className="font-extrabold text-xs text-zinc-200 leading-tight truncate">
                  {name || 'Product Name'}
                </h3>
                
                <div className="flex justify-between items-center select-none">
                  <span className="text-[8px] font-black text-zinc-400 uppercase tracking-wider">
                    Stock: {stockQuantity || '0'}
                  </span>
                  
                  {parseInt(stockQuantity || '0', 10) === 0 ? (
                    <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md bg-rose-500 text-white leading-none">
                      Sold Out
                    </span>
                  ) : parseInt(stockQuantity || '0', 10) <= 5 ? (
                    <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md bg-amber-500 text-zinc-950 leading-none">
                      Low
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-zinc-555 font-bold mt-5 text-center px-4 max-w-xs leading-relaxed">
              * This is an exact preview of how the item card will materialize in the main cashier POS screen, nya!
            </p>
          </div>
        </div>

      </div>

      <DeleteProductConfirmModal
        isOpen={showDeleteModal}
        product={product}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
