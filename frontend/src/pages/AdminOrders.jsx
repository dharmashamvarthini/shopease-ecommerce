import { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` },
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        "https://shopease-ecommerce-ruddy.vercel.app/api/orders",
        config
      );
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `https://shopease-ecommerce-ruddy.vercel.app/api/orders/${id}/status`,
        { status },
        config
      );
      fetchOrders();
      alert(`Order status updated to ${status}`);
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📋 Manage Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold">Order #{o._id.slice(-6)}</p>
                  <p className="text-sm text-gray-600">
                    {o.user?.name} ({o.user?.email})
                  </p>
                  <p className="text-sm">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{o.totalPrice}</p>
                  <p className="text-sm">
                    {o.isPaid ? "✅ Paid" : "❌ Not Paid"}
                  </p>
                  <p className="text-xs text-gray-500">{o.paymentMethod}</p>
                </div>
              </div>

              <div className="border-t pt-2 mt-2">
                {o.orderItems.map((item, i) => (
                  <p key={i} className="text-sm">
                    {item.name} × {item.qty} — ₹{item.price}
                  </p>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm font-bold">Status:</span>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
