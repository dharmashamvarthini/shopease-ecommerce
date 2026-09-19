import { useEffect, useState } from "react";
import axios from "axios";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
  });
  const [editingId, setEditingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token}`,
    },
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products");
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          form,
          config
        );
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/products", form, config);
      }
      setForm({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        stock: "",
      });
      fetchProducts();
      alert(editingId ? "Product updated!" : "Product added!");
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
    });
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        fetchProducts();
        alert("Product deleted");
      } catch (error) {
        alert(error.response?.data?.message || "Error");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📦 Manage Products</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <h2 className="text-xl font-bold md:col-span-2">
          {editingId ? "✏️ Edit Product" : "➕ Add New Product"}
        </h2>

        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="border p-2 rounded md:col-span-2"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded md:col-span-2"
          rows="3"
          required
        />
        <div className="flex gap-2 md:col-span-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  name: "",
                  description: "",
                  price: "",
                  image: "",
                  category: "",
                  stock: "",
                });
              }}
              className="bg-gray-500 text-white px-4 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded-lg shadow">
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.category}</p>
            <p className="text-lg font-bold">₹{p.price}</p>
            <p className="text-sm">Stock: {p.stock}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(p)}
                className="bg-yellow-500 text-white px-3 py-1 rounded flex-1 hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-500 text-white px-3 py-1 rounded flex-1 hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;