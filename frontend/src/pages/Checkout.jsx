import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [address, setAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  // Cash on Delivery
  const placeOrderCOD = async () => {
    if (!address.address || !address.city) return alert("Fill address");
    setLoading(true);
    try {
      const orderItems = cart.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      }));

      await axios.post(
        "http://localhost:5000/api/orders",
        {
          orderItems,
          shippingAddress: address,
          paymentMethod: "COD",
          totalPrice,
        },
        config
      );

      localStorage.removeItem("cart");
      alert("Order placed! (Cash on Delivery)");
      navigate("/myorders");
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
    setLoading(false);
  };

  // Mock Online Payment
  const payWithMock = async () => {
    if (!address.address || !address.city) return alert("Fill address");
    setLoading(true);

    try {
      // 1. Create order in DB (unpaid)
      const orderItems = cart.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      }));

      const { data: dbOrder } = await axios.post(
        "http://localhost:5000/api/orders",
        {
          orderItems,
          shippingAddress: address,
          paymentMethod: "Mock Payment",
          totalPrice,
        },
        config
      );

      // 2. Create mock payment order
      const { data: mockOrder } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: totalPrice },
        config
      );

      // 3. Simulate payment delay (1.5 sec)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 4. Verify mock payment
      await axios.post(
        "http://localhost:5000/api/payment/verify",
        {
          orderId: dbOrder._id,
          mockOrderId: mockOrder.id,
          mockPaymentId: `mock_pay_${Date.now()}`,
        },
        config
      );

      localStorage.removeItem("cart");
      alert("✅ Mock Payment Successful! Order confirmed 🎉");
      navigate("/myorders");
    } catch (error) {
      alert(error.response?.data?.message || "Payment failed");
    }
    setLoading(false);
  };

  if (!user) return <p className="text-center p-8">Please login</p>;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
        <input
          type="text"
          placeholder="Address"
          value={address.address}
          onChange={(e) => setAddress({ ...address, address: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="City"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={address.postalCode}
          onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Country"
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
          className="border p-2 rounded w-full mb-4"
        />

        {/* Order Summary */}
        <div className="border-t pt-4 mb-4">
          <h3 className="font-bold mb-2">Order Summary</h3>
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between text-sm mb-1">
              <span>
                {item.name} × {item.qty}
              </span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        {/* Payment Buttons */}
        <div className="flex gap-3">
          <button
            onClick={placeOrderCOD}
            disabled={loading}
            className="flex-1 bg-gray-700 text-white py-3 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Processing..." : "💵 Cash on Delivery"}
          </button>
          <button
            onClick={payWithMock}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "💳 Pay Online (Mock)"}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-3">
          ⚠️ Mock payment — no real money involved (testing only)
        </p>
      </div>
    </div>
  );
};

export default Checkout;