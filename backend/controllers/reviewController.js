import Review from "../models/Review.js";
import Product from "../models/Product.js";

// Get reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add review
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
    });

    // Update product rating
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await product.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete review (admin)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const productId = review.product;
    await review.deleteOne();

    const reviews = await Review.find({ product: productId });
    const product = await Product.findById(productId);
    if (product) {
      product.numReviews = reviews.length;
      product.rating = reviews.length
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;
      await product.save();
    }

    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};