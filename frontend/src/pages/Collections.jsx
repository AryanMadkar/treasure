import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaGem,
  FaCrown,
  FaHeart,
  FaStar,
  FaBolt,
  FaSkull,
  FaEye,
  FaShoppingCart,
  FaSearch,
} from "react-icons/fa";

const Collections = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Memoized jewelry data
  const jewelryData = useMemo(
    () => [
      {
        id: 1,
        name: "Midnight Empress Ring",
        category: "rings",
        price: 2499,
        images: [
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop",
        ],
        description: "Gothic black diamond ring with neon purple accents",
        rarity: "legendary",
        glow: "purple",
      },
      {
        id: 2,
        name: "Neon Soul Necklace",
        category: "necklaces",
        price: 3299,
        images: [
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop",
        ],
        description: "Cyberpunk-inspired chain with holographic crystals",
        rarity: "epic",
        glow: "cyan",
      },
      {
        id: 3,
        name: "Shadowfire Earrings",
        category: "earrings",
        price: 1899,
        images: [
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1588444650700-6d5d7e4a8b47?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&h=500&fit=crop",
        ],
        description: "Dark obsidian drops with electric orange highlights",
        rarity: "rare",
        glow: "orange",
      },
      {
        id: 4,
        name: "Cosmic Void Bracelet",
        category: "bracelets",
        price: 2799,
        images: [
          "https://images.unsplash.com/photo-1611955167811-4711904bb9ab?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
        ],
        description: "Space-age titanium with glowing neon inlays",
        rarity: "legendary",
        glow: "green",
      },
      {
        id: 5,
        name: "Vampire Queen Tiara",
        category: "crowns",
        price: 4999,
        images: [
          "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
        ],
        description: "Gothic crown with blood-red crystals and silver spikes",
        rarity: "mythic",
        glow: "red",
      },
      {
        id: 6,
        name: "Electric Dreams Ring",
        category: "rings",
        price: 1799,
        images: [
          "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
        ],
        description: "Futuristic ring with LED-embedded crystals",
        rarity: "rare",
        glow: "blue",
      },
      {
        id: 7,
        name: "Toxic Glamour Choker",
        category: "necklaces",
        price: 2199,
        images: [
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop",
        ],
        description: "Spiked leather choker with neon green accents",
        rarity: "epic",
        glow: "lime",
      },
      {
        id: 8,
        name: "Cybernetic Cuff",
        category: "bracelets",
        price: 3499,
        images: [
          "https://images.unsplash.com/photo-1611955167811-4711904bb9ab?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
        ],
        description: "Tech-noir bracelet with holographic displays",
        rarity: "legendary",
        glow: "pink",
      },
    ],
    []
  );

  // Memoized categories
  const categories = useMemo(
    () => [
      {
        id: "all",
        name: "All Pieces",
        icon: FaGem,
        color: "from-purple-500 to-pink-500",
      },
      {
        id: "rings",
        name: "Rings",
        icon: FaCrown,
        color: "from-yellow-400 to-orange-500",
      },
      {
        id: "necklaces",
        name: "Necklaces",
        icon: FaHeart,
        color: "from-green-400 to-cyan-500",
      },
      {
        id: "earrings",
        name: "Earrings",
        icon: FaStar,
        color: "from-blue-400 to-purple-500",
      },
      {
        id: "bracelets",
        name: "Bracelets",
        icon: FaBolt,
        color: "from-red-400 to-pink-500",
      },
      {
        id: "crowns",
        name: "Crowns",
        icon: FaSkull,
        color: "from-purple-600 to-red-500",
      },
    ],
    []
  );

  // Memoized style objects
  const rarityColors = useMemo(
    () => ({
      rare: "from-blue-400 to-blue-600",
      epic: "from-purple-400 to-purple-600",
      legendary: "from-yellow-400 to-orange-500",
      mythic: "from-red-400 to-pink-500",
    }),
    []
  );

  const glowColors = useMemo(
    () => ({
      purple: "shadow-purple-500/50",
      cyan: "shadow-cyan-500/50",
      orange: "shadow-orange-500/50",
      green: "shadow-green-500/50",
      red: "shadow-red-500/50",
      blue: "shadow-blue-500/50",
      lime: "shadow-lime-500/50",
      pink: "shadow-pink-500/50",
    }),
    []
  );

  // Optimized loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    return selectedCategory === "all"
      ? jewelryData
      : jewelryData.filter((item) => item.category === selectedCategory);
  }, [selectedCategory, jewelryData]);

  // Memoized category change handler
  const handleCategoryChange = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
  }, []);

  // Memoized ProductCard component
  const ProductCard = React.memo(({ product, index }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      if (!isHovered) return;

      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 800);

      return () => clearInterval(interval);
    }, [isHovered, product.images.length]);

    const handleMouseEnter = useCallback(() => {
      setIsHovered(true);
      setHoveredProduct(product.id);
    }, [product.id]);

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
      setHoveredProduct(null);
    }, []);

    return (
      <div
        className={`relative bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 transition-all duration-500 hover:scale-105 hover:border-${
          product.glow
        }-500 ${glowColors[product.glow]} hover:shadow-2xl group`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isLoaded ? "translateY(0)" : "translateY(50px)",
          opacity: isLoaded ? 1 : 0,
          transition: "all 0.6s ease-out",
          transitionDelay: `${index * 50}ms`,
        }}
      >
        {/* Rarity Badge */}
        <div
          className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${
            rarityColors[product.rarity]
          } text-white uppercase tracking-wider`}
        >
          {product.rarity}
        </div>

        {/* Hover Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 group-hover:from-black/10 group-hover:to-black/50 transition-all duration-500 z-10"></div>

        {/* Image Container */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {product.images.map((_, imgIndex) => (
              <div
                key={imgIndex}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  imgIndex === currentImageIndex
                    ? `bg-${product.glow}-500`
                    : "bg-gray-600"
                }`}
              />
            ))}
          </div>

          {/* Floating Icons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <div
              className={`w-8 h-8 rounded-full bg-${product.glow}-500/20 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300`}
            >
              <FaEye className={`text-${product.glow}-400 text-sm`} />
            </div>
            <div
              className={`w-8 h-8 rounded-full bg-${product.glow}-500/20 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100`}
            >
              <FaShoppingCart className={`text-${product.glow}-400 text-sm`} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 relative z-10">
          <h3 className="text-2xl font-bold text-white mb-2 transition-all duration-300">
            {product.name}
          </h3>

          <p className="text-gray-400 mb-4 text-sm leading-relaxed group-hover:text-gray-300 transition-all duration-300">
            {product.description}
          </p>

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-white">
              ${product.price.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div
            className="text-center mb-16"
            style={{
              transform: isLoaded ? "translateY(0)" : "translateY(-30px)",
              opacity: isLoaded ? 1 : 0,
              transition: "all 0.8s ease-out",
            }}
          >
            <h1 className="text-6xl lg:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
              DARK COLLECTIONS
            </h1>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Embrace the darkness with our gothic luxury jewelry collection.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105"
                }`}
                style={{
                  transform: isLoaded ? "translateY(0)" : "translateY(30px)",
                  opacity: isLoaded ? 1 : 0,
                  transition: "all 0.6s ease-out",
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <category.icon className="text-xl" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      {/* <div className="fixed bottom-8 right-8 z-50">
        <button className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xl shadow-2xl hover:scale-110 transition-all duration-300">
          <FaSearch />
        </button>
      </div> */}
    </div>
  );
};

export default Collections;
