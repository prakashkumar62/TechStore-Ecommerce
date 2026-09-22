import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const FilterSidebar = ({
  categories = [],
  brands = [],
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  minPrice,
  maxPrice,
  onPriceChange,
  inStockOnly,
  onToggleInStock,
  onResetFilters,
}) => {
  return (
    <aside className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
          Category
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <label className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer py-1">
            <input
              type="radio"
              name="category"
              checked={!selectedCategory || selectedCategory === 'all'}
              onChange={() => onSelectCategory('all')}
              className="text-indigo-600 focus:ring-indigo-500 rounded"
            />
            <span>All Categories</span>
          </label>
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer py-1"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => onSelectCategory(cat)}
                className="text-indigo-600 focus:ring-indigo-500 rounded"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
          Brand
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <label className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer py-1">
            <input
              type="radio"
              name="brand"
              checked={!selectedBrand || selectedBrand === 'all'}
              onChange={() => onSelectBrand('all')}
              className="text-indigo-600 focus:ring-indigo-500 rounded"
            />
            <span>All Brands</span>
          </label>
          {brands.map((b) => (
            <label
              key={b}
              className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer py-1"
            >
              <input
                type="radio"
                name="brand"
                checked={selectedBrand === b}
                onChange={() => onSelectBrand(b)}
                className="text-indigo-600 focus:ring-indigo-500 rounded"
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
          Price Range (₹)
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onPriceChange('min', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <span className="text-slate-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onPriceChange('max', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Availability */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span>In-Stock Only</span>
        </label>
      </div>
    </aside>
  );
};

export default FilterSidebar;
