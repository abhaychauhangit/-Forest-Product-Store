import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Categories = ({ categories }) => {

  const [selected, setSelected] = useState("All");
  console.log(selected);

  return (
    
    <div  className="flex gap-4 overflow-x-auto py-4 px-4 bg-white border-b">
      {categories.map((cat, index) => (
        <Link  key={index} to={cat === "All" ? "/" : `/category/${cat}`}>
          <button
           
            className={`px-4 py-2 rounded-full border cursor-pointer hover:bg-amber-700 hover:text-white ${
              selected === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setSelected(cat)}
          >
            {cat}
          </button>
        </Link>
      ))}
    </div>
    
  );
};

export default Categories;
