import Order from "../models/Order.js";

// @desc    Create mock payment order
// @route   POST /api/payment/create-order
// @access  Private
export const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Mock order — no Razorpay needed
    const mockOrder = {
      id: `mock_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      status: "created",
      createdAt: Date.now(),
    };

    res.json(mockOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify mock payment (always success)
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, mockOrderId, mockPaymentId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Mock verification — always success
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentMethod = "Mock Payment";
    order.paymentResult = {
      id: mockPaymentId || `mock_pay_${Date.now()}`,
      status: "success",
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };
    await order.save();

    res.json({
      success: true,
      message: "Mock payment verified successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};