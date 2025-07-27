import React, {  useCallback, useEffect } from 'react';
import Categories from '../components/Categories';
import ProductList from '../components/ProductList';
import { categories } from '../components/data/products'; 
import { useProductStore } from '../store/useProductStore';
import LoadingSpinner from '../components/LoadingSpinner';
import throttle from "lodash.throttle";

const Homepage = () => {
  

  
  
  const {products, fetchAllProducts, isLoading, hasMore } = useProductStore();
  console.log(products);
  const handleScroll = useCallback(throttle(() => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if(nearBottom) {
        fetchAllProducts();
      }
  }, 300), [isLoading, hasMore])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    fetchAllProducts();
    // if(isLoading) {
    //   return <LoadingSpinner />
    // }
  }, []);

  // function shuffleArray(arr) {
  //   for (let i = arr.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [arr[i], arr[j]] = [arr[j], arr[i]];
  //   }
  //   return arr;
  // }
  // shuffleArray(products.slice());
  
  const shuffledProducts = products;
  
  
  

  return (
    <div className="min-h-screen bg-gray-100">
      
      <Categories
        categories={categories}
      />
      {products.length > 0 ? <ProductList  products={shuffledProducts} /> : (<div className='text-center font-bold'> no products found</div>)}
      {isLoading && <p>loading...</p>}
      {!hasMore && <p>No more products</p>}
    </div>
  );
};

export default Homepage;




