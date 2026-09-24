import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);

  const { addToCart } = useCart();
  const user = JSON.parse(localStorage.getItem("user"));

  const categories = [
    "All",
    "Electronics",
    "Audio",
    "Laptops",
    "Accessories",
    "Clothing",
    "Books",
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://shopease-ecommerce-ruddy.vercel.app/api/products?keyword=${keyword}&category=${category}&sort=${sort}`
      );
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [category, sort]);

  const searchHandler = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const addToWishlist = async (productId) => {
    if (!user) return alert("Please login first");
    try {
      await axios.post(
        "https://shopease-ecommerce-ruddy.vercel.app/api/wishlist",
        { productId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Added to wishlist ❤️");
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  const addToCartHandler = (product) => {
    addToCart(product, 1);
    alert("Added to cart! 🛒");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-2">🛍️ ShopEase</h1>
      <p className="text-center text-gray-600 mb-8">Your one-stop online store</p>

      {/* Search + Filter Bar */}
      <form
        onSubmit={searchHandler}
        className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border p-2 rounded md:col-span-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="new">Newest</option>
          <option value="rating">Top Rated</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 md:col-span-4"
        >
          Search
        </button>
      </form>

      {/* Products Grid */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase">{p.category}</p>
                <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {p.description}
                </p>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xl font-bold text-blue-600">₹{p.price}</p>
                  <p className="text-sm text-gray-500">Stock: {p.stock}</p>
                </div>

                <Link
                  to={`/product/${p._id}`}
                  className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2"
                >
                  View Details
                </Link>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCartHandler(p)}
                  disabled={p.stock === 0}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-2 disabled:opacity-50"
                >
                  {p.stock === 0 ? "Out of Stock" : "Add to Cart 🛒"}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => addToWishlist(p._id)}
                  className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
                >
                  ❤️ Add to Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
