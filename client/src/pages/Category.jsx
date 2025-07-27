import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {  categories } from '../components/data/products'; 
import ProductList from '../components/ProductList';
import Categories from '../components/Categories';
import { useProductStore } from '../store/useProductStore';


const Category = () => {

  const {category} = useParams();
  
  
  const {products, fetchproductByCategory} = useProductStore();

 
  useEffect(() => {
      fetchproductByCategory(category)
  }, [fetchproductByCategory, category])
    

  

  return (
    <div className="min-h-screen bg-gray-100">
      <Categories
        categories={categories}
      />
      {products.length > 0 ? <ProductList  products={products} /> : (<div className='text-center font-bold'> no products found</div>)}
    </div>
  )
}

export default Category