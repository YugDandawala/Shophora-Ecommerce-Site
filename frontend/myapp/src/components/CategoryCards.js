import React from 'react';
import { categories } from '../data/products';

const CategoryCards = () => {
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Electronics': 'fas fa-laptop',
      'Fashion': 'fas fa-tshirt',
      'Home & Kitchen': 'fas fa-home',
      'Books': 'fas fa-book'
    };
    return iconMap[categoryName] || 'fas fa-tag';
  };

  return (
    <section className="categories">
      <div className="container">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <i className={`${getCategoryIcon(category.name)} category-icon`}></i>
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards; 