"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Package } from "lucide-react";

// Mock categories data
const mockCategories = [
  {
    id: "1",
    name: "Jewelry",
    description:
      "Handcrafted jewelry including necklaces, bracelets, and earrings",
    productCount: 45,
    status: "active",
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Pottery",
    description: "Traditional ceramic vessels, bowls, and decorative items",
    productCount: 32,
    status: "active",
    createdAt: "2023-01-20",
  },
  {
    id: "3",
    name: "Textiles",
    description: "Woven fabrics, blankets, and traditional clothing",
    productCount: 28,
    status: "active",
    createdAt: "2023-02-01",
  },
  {
    id: "4",
    name: "Home Decor",
    description:
      "Decorative items for the home including baskets and wall hangings",
    productCount: 22,
    status: "active",
    createdAt: "2023-02-10",
  },
  {
    id: "5",
    name: "Accessories",
    description: "Bags, pouches, and other personal accessories",
    productCount: 15,
    status: "draft",
    createdAt: "2023-03-01",
  },
];

export default function ArtistCategories() {
  const [categories, setCategories] = useState(mockCategories);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  const handleAddCategory = () => {
    if (formData.name.trim()) {
      const newCategory = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        productCount: 0,
        status: formData.status as "active" | "draft",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCategories([...categories, newCategory]);
      setFormData({ name: "", description: "", status: "active" });
      setShowAddForm(false);
    }
  };

  const handleEditCategory = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        status: category.status,
      });
      setEditingCategory(categoryId);
    }
  };

  const handleUpdateCategory = () => {
    if (editingCategory && formData.name.trim()) {
      setCategories(
        categories.map((category) =>
          category.id === editingCategory
            ? {
                ...category,
                name: formData.name,
                description: formData.description,
                status: formData.status as "active" | "draft",
              }
            : category
        )
      );
      setFormData({ name: "", description: "", status: "active" });
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category && category.productCount > 0) {
      alert(
        `Cannot delete category "${category.name}" because it contains ${category.productCount} products. Please move or delete the products first.`
      );
      return;
    }

    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((c) => c.id !== categoryId));
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "", status: "active" });
    setShowAddForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-light text-stone-900 mb-2">
            Categories
          </h1>
          <p className="text-stone-600">
            Organize your products into categories
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 bg-terracotta-600 text-white px-4 py-2 hover:bg-terracotta-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingCategory) && (
        <div className="bg-white border border-stone-200 p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-medium text-stone-900 mb-4">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-stone-300 focus:border-terracotta-500 focus:outline-none"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-stone-300 focus:border-terracotta-500 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-stone-300 focus:border-terracotta-500 focus:outline-none"
              placeholder="Enter category description"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={
                editingCategory ? handleUpdateCategory : handleAddCategory
              }
              className="bg-terracotta-600 text-white px-4 py-2 hover:bg-terracotta-700 transition-colors"
            >
              {editingCategory ? "Update Category" : "Add Category"}
            </button>
            <button
              onClick={handleCancel}
              className="border border-stone-300 text-stone-700 px-4 py-2 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white border border-stone-200 p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-stone-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-stone-600 text-sm mb-3">
                  {category.description}
                </p>
                <div className="flex items-center text-sm text-stone-500 mb-2">
                  <Package className="w-4 h-4 mr-1" />
                  {category.productCount} products
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    category.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {category.status}
                </span>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEditCategory(category.id)}
                  className="text-stone-400 hover:text-terracotta-600"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-stone-400 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-xs text-stone-400">
              Created: {new Date(category.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-stone-400 mb-4">
            <Package className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-stone-900 mb-2">
            No categories yet
          </h3>
          <p className="text-stone-600 mb-4">
            Create your first category to organize your products
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-terracotta-600 text-white hover:bg-terracotta-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Category
          </button>
        </div>
      )}
    </div>
  );
}
