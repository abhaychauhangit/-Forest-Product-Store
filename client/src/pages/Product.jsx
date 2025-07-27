import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import toast from 'react-hot-toast';


const Product = () => {
  const {id} = useParams();
  const {fetchSingleProduct, productDetails } = useProductStore();
  const {user } = useUserStore();
  const {addToCart } = useCartStore();
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchSingleProduct(id);
  }, [fetchSingleProduct, id])

  const handleAddToCart = () => {
    if(!user) navigate("/login");
    else {
      addToCart(productDetails);
      toast.success("added to cart successfully")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-[700px] bg-white shadow-lg rounded-lg mt-[65px] overflow-hidden p-6">
          <img 
            src={productDetails?.image} 
            alt={productDetails?.name} 
            className="w-full h-[400px] object-contain rounded-md mb-6" 
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{productDetails?.name}</h2>
          <p className="text-xl text-green-600 font-semibold mb-4">${productDetails?.price}</p>
         
            <ul className='list-disc pl-5 mb-4'>
              {productDetails?.description?.map((d, index) => (
                <li key={index}>
                  {d}
                </li>
              ))}
            </ul>
          
    
          {/* Buttons */}
          <div className="flex flex-col gap-4 justify-center items-center">
            <button 
              className=" bg-blue-600 w-[120px] text-white py-2 px-4 rounded-[10px] hover:bg-blue-700 transition duration-300"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button 
              className=" bg-green-600 w-[120px] text-white py-2 px-4 rounded-[10px] hover:bg-green-700 transition duration-300"
              onClick={() => console.log('Buy Now clicked')}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
  )
}

export default Product;