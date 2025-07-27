import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { categories } from '../components/data/products';
import Categories from '../components/Categories';
import ProductList from '../components/ProductList';


const SearchedProducts = () => {

    const { fetchSearchedProducts, searchedProducts } = useProductStore();
    const {query} = useParams();

    useEffect(() => {
        fetchSearchedProducts(query);
    }, [fetchSearchedProducts, query])


    

    
    return (

        <div className="min-h-screen bg-gray-100">
        
            <Categories
                categories={categories}
            />
            {searchedProducts.length > 0 ? <ProductList  products={searchedProducts} /> : (<div className='text-center font-bold'> no products found</div>)}
        </div>
    )
}


export default SearchedProducts