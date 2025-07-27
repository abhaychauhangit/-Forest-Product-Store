import { Contact, Home, LogIn, LogOut } from 'lucide-react'
import React from 'react'
import { Link } from "react-router-dom"



const Sidebar = ({ isCollapsed }) => {
   

    return (
        <aside className={`h-[calc(100vh-65px)] p-[32px] flex flex-col  absolute text-white bg-black ${isCollapsed ? "hidden" : "w-[200px]"}`}>
            <div className='flex flex-col w-[120px] gap-[32px]  left-9 absolute'>
                <Link className='flex  justify-start  gap-[12px] ' to='/'>
                    <Home /> {
                        !isCollapsed ? <span className=' text-[16px]'>HOME</span> 
                        : null
                    }
                </Link>

                <Link className='flex  justify-start  gap-[12px] ' to='/'>
                    <Contact /> {
                        !isCollapsed ? <span className=' text-[16px]'>CONTACT</span> 
                        : null
                    }
                </Link>
                <Link className='flex  justify-start  gap-[12px] ' to='/'>
                    <Home /> {
                        !isCollapsed ? <span className=' text-[16px]'>ABOUT</span> 
                        : null
                    }
                </Link>
                
                <Link className='flex  justify-start  gap-[12px] ' to='/signup'>
                    <LogIn /> {
                        !isCollapsed ? <span className=' text-[16px]'>Sign Up</span> 
                        : null
                    }
                </Link>
                
            </div>
        </aside>
    )
}

export default Sidebar