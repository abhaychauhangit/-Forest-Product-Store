import React, { useState } from 'react';
import {ShoppingCart}  from "lucide-react";
import { Link } from 'react-router-dom';


const ProductList = ({ products }) => {

  


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {products.map((product) => (
        <Link key={product.name} to={`/products/${product._id}`}>
          <div  className="bg-white rounded-lg shadow p-4" >
            <img src={product.image} alt={product.name} className="w-full h-40 object-contain rounded" />
            <h2 className="mt-4 text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-500">{product.price}</p>
            <p className="text-sm mt-2 text-gray-600">{product.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
