import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [qty, setQty] = useState(1);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
    setProduct(data);
  };

  const fetchReviews = async () => {
    const { data } = await axios.get(`http://localhost:5000/api/reviews/${id}`);
    setReviews(data);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login");
    try {
      await axios.post(
        `http://localhost:5000/api/reviews/${id}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setComment("");
      fetchReviews();
      fetchProduct();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  const addToCartHandler = () => {
    addToCart(product, qty);
    alert("Added to cart! 🛒");
    navigate("/cart");
  };

  if (!product) return <p className="text-center p-8">Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-lg shadow"
        />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="text-2xl font-bold text-blue-600 mt-4">
            ₹{product.price}
          </p>
          <p className="mt-2">Stock: {product.stock}</p>
          <p className="mt-2">
            ⭐ {product.rating?.toFixed(1) || 0} ({product.numReviews} reviews)
          </p>

          {/* Quantity */}
          <div className="mt-4 flex items-center gap-3">
            <label className="font-bold">Qty:</label>
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="border p-2 rounded"
            >
              {[...Array(product.stock).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={addToCartHandler}
            disabled={product.stock === 0}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart 🛒"}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>

        {user && (
          <form
            onSubmit={submitReview}
            className="bg-white p-4 rounded shadow mb-6"
          >
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="border p-2 rounded mb-2"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>
            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border p-2 rounded w-full mb-2"
              rows="3"
              required
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Submit Review
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white p-4 rounded shadow">
                <p className="font-bold">{r.user?.name}</p>
                <p className="text-yellow-500">{"⭐".repeat(r.rating)}</p>
                <p className="text-gray-700 mt-1">{r.comment}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;