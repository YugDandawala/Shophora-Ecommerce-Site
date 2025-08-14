import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { categories } from '../data/products';

const ProductFilters = () => {
  const { filters, setFilters, clearFilters } = useEcommerce();

  const handleFilterChange = (filterType, value) => {
    setFilters({ [filterType]: value });
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleSearchChange = (e) => {
    setFilters({ search: e.target.value });
  };

  return (
    <section className="filters">
      <div className="container">
        <div className="filter-row">
          <h3>Filter Products</h3>
          <button 
            onClick={handleClearFilters}
            className="nav-button btn-secondary"
          >
            Clear All
          </button>
        </div>
        
        {/* Search Input */}
        <div className="search-section">
          <div className="search-input-container">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={filters.search}
              onChange={handleSearchChange}
              className="search-input"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ search: '' })}
                className="clear-search-btn"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
        
        <div className="filter-controls">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="filter-select"
          >
            <option value="">All Brands</option>
            <option value="TechAudio">TechAudio</option>
            <option value="WristTech">WristTech</option>
            <option value="FashionHub">FashionHub</option>
            <option value="PhotoPro">PhotoPro</option>
            <option value="BookWorld">BookWorld</option>
            <option value="CookMaster">CookMaster</option>
            <option value="GameTech">GameTech</option>
          </select>

          <select
            value={filters.price}
            onChange={(e) => handleFilterChange('price', e.target.value)}
            className="filter-select"
          >
            <option value="">All Prices</option>
            <option value="0-50">Under ₹500</option>
            <option value="50-100">₹500 - ₹1000</option>
            <option value="100-200">₹1000 - ₹2000</option>
            <option value="200-500">₹2000 - ₹5000</option>
            <option value="500+">Over ₹5000</option>
          </select>

          <select
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="filter-select"
          >
            <option value="">All Ratings</option>
            <option value="4.5+">4.5+ Stars</option>
            <option value="4.0+">4.0+ Stars</option>
            <option value="3.5+">3.5+ Stars</option>
            <option value="3.0+">3.0+ Stars</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="filter-select"
          >
            <option value="createdAt">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default ProductFilters; 