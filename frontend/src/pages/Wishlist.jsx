import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const user = JSON.parse(localStorage.getItem("user"));

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const fetchWishlist = async () => {
    const { data } = await axios.get("http://localhost:5000/api/wishlist", config);
    setWishlist(data);
  };

  useEffect(() => {
    if (user) fetchWishlist();
  }, []);

  const removeFromWishlist = async (id) => {
    await axios.delete(`http://localhost:5000/api/wishlist/${id}`, config);
    fetchWishlist();
  };

  if (!user) return <p className="text-center p-8">Please login to view wishlist</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">❤️ My Wishlist</h1>
      {wishlist.products.length === 0 ? (
        <p className="text-center text-gray-500">Wishlist empty</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wishlist.products.map((p) => (
            <div key={p._id} className="bg-white rounded-lg shadow">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-blue-600 font-bold">₹{p.price}</p>
                <div className="flex gap-2 mt-3">
                  <Link
                    to={`/product/${p._id}`}
                    className="flex-1 text-center bg-blue-600 text-white py-2 rounded"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(p._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;