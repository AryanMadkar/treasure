import React from "react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

const ProductCard = ({ product }) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="relative group overflow-hidden rounded-2xl border border-gray-800 hover:border-purple-500 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300 z-10" />
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black via-black/80 to-transparent">
        <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-purple-400">
            ${product.price.toLocaleString()}
          </span>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors duration-300 text-sm font-semibold">
            Add to Cart
          </button>
        </div>
      </div>
      <div
        className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase rounded-full bg-gradient-to-r from-${product.glow}-500 to-${product.glow}-400 text-white z-20`}
      >
        {product.rarity}
      </div>
    </motion.div>
  );
};

export default ProductCard;