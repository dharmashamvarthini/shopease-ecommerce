import { useState, useEffect } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/myorders");
        setOrders(data);
      } catch (error) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center text-2xl">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">No Orders Yet 📦</h1>
        <p className="text-gray-600">Start shopping to see your orders here!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-5 rounded-lg shadow">
            <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono text-sm">{order._id}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <div className="border-t pt-3">
              <p className="text-sm text-gray-600 mb-2">
                <b>Date:</b> {new Date(order.createdAt).toLocaleString()}
              </p>

              <div className="space-y-2">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/50";
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.qty} × ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {order.isPaid ? "✅ Paid" : "❌ Not Paid"}
                </span>
                <span className="text-lg font-bold text-green-600">
                  ₹{order.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;