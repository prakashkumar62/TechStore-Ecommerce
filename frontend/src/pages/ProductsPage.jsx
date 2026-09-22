import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import FilterSidebar from '../components/product/FilterSidebar';
import { ProductSkeleton } from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read URL search params
  const currentCategory = searchParams.get('category') || 'all';
  const currentBrand = searchParams.get('brand') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentSearch = searchParams.get('search') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentInStock = searchParams.get('inStock') === 'true';

  // Fetch filter metadata (categories, brands)
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await productService.getProductMeta();
        if (res.success && res.data) {
          setCategories(res.data.categories || []);
          setBrands(res.data.brands || []);
        }
      } catch (err) {
        console.error('Failed to load categories/brands:', err);
      }
    };
    fetchMeta();
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        sort: currentSort,
      };

      if (currentSearch) params.search = currentSearch;
      if (currentCategory && currentCategory !== 'all') params.category = currentCategory;
      if (currentBrand && currentBrand !== 'all') params.brand = currentBrand;
      if (currentMinPrice) params.minPrice = currentMinPrice;
      if (currentMaxPrice) params.maxPrice = currentMaxPrice;
      if (currentInStock) params.inStock = 'true';

      const res = await productService.getProducts(params);
      if (res.success && res.data) {
        setProducts(res.data);
        setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    currentSort,
    currentSearch,
    currentCategory,
    currentBrand,
    currentMinPrice,
    currentMaxPrice,
    currentInStock,
  ]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handlePriceChange = (type, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (type === 'min') {
      if (val) newParams.set('minPrice', val);
      else newParams.delete('minPrice');
    } else {
      if (val) newParams.set('maxPrice', val);
      else newParams.delete('maxPrice');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Breadcrumb / Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {currentCategory !== 'all' ? currentCategory : 'All Electronics & Gadgets'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {pagination.total || products.length} premium products
            {currentSearch && <span> matching "<strong className="text-indigo-600">{currentSearch}</strong>"</span>}
          </p>
        </div>

        {/* Filter Trigger (Mobile) & Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Search / Filter Chips */}
      {(currentSearch || currentCategory !== 'all' || currentBrand !== 'all' || currentMinPrice || currentMaxPrice || currentInStock) && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-[11px] font-semibold text-slate-400">Active Filters:</span>
          {currentSearch && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
              Search: {currentSearch}
              <button onClick={() => updateParam('search', '')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {currentCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
              Category: {currentCategory}
              <button onClick={() => updateParam('category', 'all')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {currentBrand !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
              Brand: {currentBrand}
              <button onClick={() => updateParam('brand', 'all')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {currentInStock && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
              In Stock Only
              <button onClick={() => updateParam('inStock', '')}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-xs text-rose-600 font-semibold hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-6">
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block">
          <FilterSidebar
            categories={categories}
            brands={brands}
            selectedCategory={currentCategory}
            onSelectCategory={(cat) => updateParam('category', cat)}
            selectedBrand={currentBrand}
            onSelectBrand={(b) => updateParam('brand', b)}
            minPrice={currentMinPrice}
            maxPrice={currentMaxPrice}
            onPriceChange={handlePriceChange}
            inStockOnly={currentInStock}
            onToggleInStock={(val) => updateParam('inStock', val ? 'true' : '')}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Products Grid Column */}
        <div className="md:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No products matched your criteria"
              description="Try adjusting your filters, searching for a different keyword, or resetting all filters."
              actionLabel="Reset All Filters"
              onActionClick={handleResetFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => updateParam('page', String(currentPage - 1))}
                    className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParam('page', String(p))}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        p === currentPage
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={currentPage >= pagination.pages}
                    onClick={() => updateParam('page', String(currentPage + 1))}
                    className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          ></div>
          <div className="relative ml-auto w-full max-w-xs h-full bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-sm text-slate-900">Filter Products</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar
              categories={categories}
              brands={brands}
              selectedCategory={currentCategory}
              onSelectCategory={(cat) => {
                updateParam('category', cat);
                setMobileFilterOpen(false);
              }}
              selectedBrand={currentBrand}
              onSelectBrand={(b) => {
                updateParam('brand', b);
                setMobileFilterOpen(false);
              }}
              minPrice={currentMinPrice}
              maxPrice={currentMaxPrice}
              onPriceChange={handlePriceChange}
              inStockOnly={currentInStock}
              onToggleInStock={(val) => {
                updateParam('inStock', val ? 'true' : '');
                setMobileFilterOpen(false);
              }}
              onResetFilters={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
