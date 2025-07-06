import React from "react";
import { motion } from "framer-motion";

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          className={`px-5 py-2 rounded-full font-semibold transition-colors duration-300 flex items-center gap-2 ${
            selectedCategory === category.id
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg">{category.icon}</span>
          <span>{category.name}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;