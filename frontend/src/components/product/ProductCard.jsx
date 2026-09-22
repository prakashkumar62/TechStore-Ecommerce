import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorite = isInWishlist(product._id);
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80';

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Media & Badges */}
      <div className="relative overflow-hidden bg-slate-50 aspect-square">
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all ${
            isFavorite
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm'
          }`}
          title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Discount Badge */}
        {discountPercent && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide bg-rose-600 text-white shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-10 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        <Link to={`/products/${product.slug || product._id}`}>
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Stock Indicator */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-600">
              {product.brand} • {product.category}
            </span>
            {isLowStock && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                Only {product.stock} left!
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link
            to={`/products/${product.slug || product._id}`}
            className="block text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              {product.rating ? product.rating.toFixed(1) : '4.5'}
            </span>
            <span className="text-[11px] text-slate-400">
              ({product.numReviews || 12})
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200'
            }`}
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
