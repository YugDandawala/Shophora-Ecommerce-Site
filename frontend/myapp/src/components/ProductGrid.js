import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import ProductCard from './ProductCard';

const ProductGrid = ({ onQuickView }) => {
  const { filteredProducts } = useEcommerce();
  const [viewMode, setViewMode] = useState('grid');

  return (
    <section className="products">
      <div className="container">
        <div className="products-header">
          <div className="product-count">
            {filteredProducts.length} products found
          </div>
          <div className="view-toggle">
            <button
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <i className="fas fa-th"></i>
            </button>
            <button
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>

        <div className={`product-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid; 