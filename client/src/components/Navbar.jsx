import React, { useState } from 'react'
import { ListCollapse, LogOut, Search, ShoppingCart } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import { useProductStore } from '../store/useProductStore';
import { useUserStore } from '../store/useUserStore';


const Navbar = ({onToggleSidebar}) => {
    
    const [query, setQuery] = useState("");
    const {user, logout} = useUserStore();
    
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate(`/products/search/${query}`);
        setQuery("");
    }

  return (
    <nav className='h-[60px] flex justify-between p-[16px] text-white ' style={{backgroundColor: "hsl(4,20%,20%)"}} >
        <div className='flex items-center gap-[20px]  ml-[20px] ' >
            <ListCollapse className='hover:cursor-pointer' onClick={onToggleSidebar}  />
            <Link to="/" className='text-[18px] font-bold'>E-SHOP</Link>
            <div className='flex ml-[400px]'>
                <input
                    type="text" 
                    placeholder='Search Products'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className='bg-white w-[300px] py-[8px] text-center rounded-l-[20px] outline-none text-black'
                />
                <button
                    onClick={handleSearch} 
                    className='bg-white w-[40px] rounded-r-[20px] p-[4px]'
                >
                    <Search className='text-black'/>
                </button>
            </div>

        </div>
        <div className='flex justify-between gap-5 text-[16px] mr-[20px]'> 
            <Link to="/">
                Home
            </Link>
            <Link to="/cart">
                <div className='flex gap-[4px]'>
                    <ShoppingCart /> Cart
                </div>
            </Link>
            {
                    user ? (
                     <button onClick={logout} className='flex gap-[4px]'>
                        <LogOut /> 
                        <span className=' text-[16px]'>LOGOUT</span> 
                     </button>
                        
                    ) : (
                        <Link to="/login">
                            Login
                        </Link>
                    )
                }
            
            <Link to="/profile">
                Profile
            </Link>
        </div>
    </nav>
  )
}

export default Navbar