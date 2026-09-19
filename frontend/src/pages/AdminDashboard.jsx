import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user?.token}` },
        };

        const { data: products } = await axios.get(
          "http://localhost:5000/api/products"
        );
        const { data: orders } = await axios.get(
          "http://localhost:5000/api/orders",
          config
        );

        const revenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);

        setStats({
          products: products.length,
          orders: orders.length,
          revenue,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛠️ Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
          <p className="text-sm">Total Products</p>
          <p className="text-3xl font-bold">{stats.products}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
          <p className="text-sm">Total Orders</p>
          <p className="text-3xl font-bold">{stats.orders}</p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-lg shadow">
          <p className="text-sm">Total Revenue</p>
          <p className="text-3xl font-bold">₹{stats.revenue}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold mb-2">📦 Manage Products</h2>
          <p className="text-gray-600">Add, edit, delete products</p>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold mb-2">📋 Manage Orders</h2>
          <p className="text-gray-600">View and update order status</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;