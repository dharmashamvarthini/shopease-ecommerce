import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const logoutHandler = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          🛒 ShopEase
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:underline">Home</Link>

          <Link to="/cart" className="hover:underline">Cart 🛒</Link>

          {user && (
            <>
              <Link to="/wishlist" className="hover:underline">❤️ Wishlist</Link>
              <Link to="/myorders" className="hover:underline">My Orders</Link>
            </>
          )}

          {user && user.role === "admin" && (
            <Link to="/admin" className="hover:underline font-bold">🛠️ Admin</Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">Hi, {user.name}</span>
              <button
                onClick={logoutHandler}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;