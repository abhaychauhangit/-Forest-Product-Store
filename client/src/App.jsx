import { useEffect, useState } from "react"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import {Toaster} from "react-hot-toast";
import Category from "./pages/Category";
import Product from "./pages/product";
import { useProductStore } from "./store/useProductStore";
import SearchedProducts from "./pages/SearchedProducts";
import Cart from "./pages/Cart";
import { useCartStore } from "./store/useCartStore";
import { useUserStore } from "./store/useUserStore";








function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const {getCartItems} = useCartStore();
  const {user, checkAuth, checkingAuth} = useUserStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  useEffect(() => {
		if (!user) return;
		
		getCartItems();
	}, [getCartItems, user])



  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  }
  
 
  return (
    <>
      
      <div className="min-h-screen  ">
        <Navbar onToggleSidebar={toggleSidebar} /> 
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/products/search/:query" element={<SearchedProducts />} />
        </Routes>
        
        <Toaster />
      </div>
      
    </>
  )
}

export default App
