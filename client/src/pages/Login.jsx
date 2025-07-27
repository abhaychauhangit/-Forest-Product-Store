import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, loading} = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({email, password});
  };

  return (
    <motion.div
      className="flex flex-col justify-center items-center h-[calc(100vh-60px)] bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Heading */}
      <motion.h1
        className="text-4xl font-semibold mb-8"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
       Sign In
      </motion.h1>

      {/* Signup Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white text-black p-8 rounded-lg shadow-lg w-96"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-black mb-[16px] text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
          disabled={loading}
        >
          Log In
        </button>
        <Link to="/signup" className='ml-[56px]' >
          New to Shop ? <span className='font-bold hover:text-blue-500 '>Sign up</span>
        </Link>
      </motion.form>
    </motion.div>
  );
};

export default Login;
