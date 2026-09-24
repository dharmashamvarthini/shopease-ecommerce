import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300";
        }}
      />
      <div className="p-4">
        <span className="text-xs text-blue-600 font-semibold uppercase">
          {product.category}
        </span>
        <h3 className="text-lg font-bold mt-1 truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-xl font-bold text-green-600">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500">
            Stock: {product.stock}
          </span>
        </div>
        <Link
          to={`/product/${product._id}`}
          className="block mt-3 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
