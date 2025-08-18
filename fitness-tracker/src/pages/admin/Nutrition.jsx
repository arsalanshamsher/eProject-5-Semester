import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

export default function Nutrition() {
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    mealType: "breakfast",
    items: [
      { name: "", quantity: "", calories: "", protein: "", carbs: "", fat: "" },
    ],
  });

  useEffect(() => {
    fetchNutritionLogs();
  }, []);

  const fetchNutritionLogs = async () => {
    try {
      const token = getToken();
      const response = await axios.get("http://localhost:5000/api/nutrition", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNutritionLogs(response.data);
    } catch (error) {
      console.error("Error fetching nutrition logs:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (editingLog) {
        await axios.put(
          `http://localhost:5000/api/nutrition/${editingLog._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/nutrition", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchNutritionLogs();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving nutrition log:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this nutrition log?")) {
      try {
        const token = getToken();
        await axios.delete(`http://localhost:5000/api/nutrition/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchNutritionLogs();
      } catch (error) {
        console.error("Error deleting nutrition log:", error);
      }
    }
  };

  const handleEdit = (log) => {
    setEditingLog(log);
    setFormData({
      date: new Date(log.date).toISOString().split("T")[0],
      mealType: log.mealType,
      items: log.items,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      mealType: "breakfast",
      items: [
        {
          name: "",
          quantity: "",
          calories: "",
          protein: "",
          carbs: "",
          fat: "",
        },
      ],
    });
    setEditingLog(null);
  };

  const addFoodItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: "",
          quantity: "",
          calories: "",
          protein: "",
          carbs: "",
          fat: "",
        },
      ],
    }));
  };

  const removeFoodItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateFoodItem = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const calculateTotals = (items) => {
    return items.reduce(
      (totals, item) => ({
        calories: totals.calories + (Number(item.calories) || 0),
        protein: totals.protein + (Number(item.protein) || 0),
        carbs: totals.carbs + (Number(item.carbs) || 0),
        fat: totals.fat + (Number(item.fat) || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const getMealTypeColor = (mealType) => {
    const colors = {
      breakfast: "bg-orange-500",
      lunch: "bg-green-500",
      dinner: "bg-blue-500",
      snack: "bg-purple-500",
    };
    return colors[mealType] || "bg-gray-500";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-extrabold text-white drop-shadow-md">
          Nutrition Tracking
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Log Meal
        </button>
      </div>

      {/* Nutrition Form */}
      {showForm && (
        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-white">
            {editingLog ? "Edit Meal Log" : "Log New Meal"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="p-3 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <select
                value={formData.mealType}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mealType: e.target.value }))
                }
                className="p-3 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Food Items</h4>
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/10 rounded-xl shadow-md"
                >
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Food Name"
                      value={item.name}
                      onChange={(e) =>
                        updateFoodItem(index, "name", e.target.value)
                      }
                      className="p-3 rounded-lg border border-gray-300 bg-white text-black focus:ring-2 focus:ring-green-500 col-span-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) =>
                        updateFoodItem(index, "quantity", e.target.value)
                      }
                      className="p-3 rounded-lg border border-gray-300 bg-white text-black focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="number"
                      placeholder="Calories"
                      value={item.calories}
                      onChange={(e) =>
                        updateFoodItem(index, "calories", e.target.value)
                      }
                      className="p-3 rounded-lg border border-gray-300 bg-white text-black focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="number"
                      placeholder="Protein (g)"
                      value={item.protein}
                      onChange={(e) =>
                        updateFoodItem(index, "protein", e.target.value)
                      }
                      className="p-3 rounded-lg border border-gray-300 bg-white text-black focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="number"
                      placeholder="Carbs (g)"
                      value={item.carbs}
                      onChange={(e) =>
                        updateFoodItem(index, "carbs", e.target.value)
                      }
                      className="p-3 rounded-lg border border-gray-300 bg-white text-black focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="number"
                      placeholder="Fat (g)"
                      value={item.fat}
                      onChange={(e) =>
                        updateFoodItem(index, "fat", e.target.value)
                      }
                      className="p-3 rounded-lg border border-gray-300 bg-white text-black focus:ring-2 focus:ring-green-500"
                    />
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFoodItem(index)}
                        className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 flex items-center justify-center rounded-full shadow transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addFoodItem}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md"
              >
                + Add Food Item
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {editingLog ? "Update Meal" : "Log Meal"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Nutrition Logs List */}
      <div className="space-y-6">
        {nutritionLogs.map((log) => {
          const totals = calculateTotals(log.items);
          return (
            <div
              key={log._id}
              className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {new Date(log.date).toLocaleDateString()}
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white mt-2 ${getMealTypeColor(
                      log.mealType
                    )}`}
                  >
                    {log.mealType.charAt(0).toUpperCase() +
                      log.mealType.slice(1)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    {totals.calories} cal
                  </p>
                  <p className="text-sm text-gray-300">
                    P: {totals.protein}g | C: {totals.carbs}g | F: {totals.fat}g
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {log.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm text-gray-200"
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-400">
                      {item.quantity} • {item.calories} cal
                      {item.protein && ` • P: ${item.protein}g`}
                      {item.carbs && ` • C: ${item.carbs}g`}
                      {item.fat && ` • F: ${item.fat}g`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(log)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(log._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {nutritionLogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No nutrition logs found. Start logging your meals to track your
            nutrition!
          </p>
        </div>
      )}
    </div>
  );
}
