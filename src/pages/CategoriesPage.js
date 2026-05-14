import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Trash2,
  Edit,
  FolderOpen,
  Search,
} from "lucide-react";

const Categories = () => {
  const token = sessionStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategories(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create / Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        name,
        isActive,
      };

      if (editId) {
        await axios.put(
          `http://localhost:5000/api/categories/${editId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/categories",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setName("");
      setIsActive(true);
      setEditId(null);

      fetchCategories();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Edit Category
  const handleEdit = (item) => {
    setName(item.name);
    setIsActive(item.isActive);
    setEditId(item._id);
  };

  // Delete Category
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/categories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCategories();
    } catch (error) {
      console.log(error);
    }
  };

  // Search Filter
  const filteredCategories = categories.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-sky-700 rounded-3xl p-8 mb-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Categories Management
            </h1>

            <p className="text-blue-100">
              Manage all laboratory categories
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4">
            <h2 className="text-3xl font-bold">
              {categories.length}
            </h2>

            <p className="text-sm text-blue-100">
              Total Categories
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <FolderOpen className="text-blue-600" />

          <h2 className="text-2xl font-bold">
            {editId ? "Update Category" : "Create Category"}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-5"
        >
          {/* Name */}
          <div className="md:col-span-2">
            <label className="font-semibold text-sm text-slate-600 block mb-2">
              Category Name
            </label>

            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="font-semibold text-sm text-slate-600 block mb-2">
              Status
            </label>

            <select
              value={isActive}
              onChange={(e) =>
                setIsActive(e.target.value === "true")
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={true}>Active</option>

              <option value={false}>Inactive</option>
            </select>
          </div>

          {/* Submit */}
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-700 to-sky-600 hover:scale-[1.02] transition-all duration-300 text-white px-8 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg"
            >
              <Plus size={18} />

              {loading
                ? "Processing..."
                : editId
                ? "Update Category"
                : "Create Category"}
            </button>
          </div>
        </form>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />

        <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">
                  #
                </th>

                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">
                  Name
                </th>

                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">
                  Slug
                </th>

                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">
                  Created
                </th>

                <th className="text-right px-6 py-4 text-sm font-bold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-slate-50 transition-all"
                >
                  {/* Index */}
                  <td className="px-6 py-4 font-semibold">
                    {index + 1}
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {item.name}
                  </td>

                  {/* Slug */}
                  <td className="px-6 py-4 text-slate-500">
                    {item.slug}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  {/* Created */}
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(
                      item.createdAt
                    ).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-xl transition-all"
                      >
                        <Edit size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          handleDelete(item._id)
                        }
                        className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-14">
              <FolderOpen
                size={50}
                className="mx-auto text-slate-300 mb-3"
              />

              <h2 className="text-xl font-bold text-slate-500">
                No Categories Found
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;