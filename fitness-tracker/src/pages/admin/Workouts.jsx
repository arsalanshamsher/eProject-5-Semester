import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "strength",
    exercises: [{ name: "", sets: "", reps: "", weight: "", notes: "" }],
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const token = getToken();
      const response = await axios.get("http://localhost:5000/api/workouts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkouts(response.data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (editingWorkout) {
        await axios.put(
          `http://localhost:5000/api/workouts/${editingWorkout._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/workouts", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchWorkouts();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        const token = getToken();
        await axios.delete(`http://localhost:5000/api/workouts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchWorkouts();
      } catch (error) {
        console.error("Error deleting workout:", error);
      }
    }
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setFormData({
      title: workout.title,
      category: workout.category,
      exercises: workout.exercises,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "strength",
      exercises: [{ name: "", sets: "", reps: "", weight: "", notes: "" }],
    });
    setEditingWorkout(null);
  };

  const addExercise = () => {
    setFormData((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { name: "", sets: "", reps: "", weight: "", notes: "" },
      ],
    }));
  };

  const removeExercise = (index) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const updateExercise = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) =>
        i === index ? { ...exercise, [field]: value } : exercise
      ),
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-extrabold text-white drop-shadow-md">
          Workout Management
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Add New Workout
        </button>
      </div>

      {/* Workout Form */}
      {showForm && (
        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-white">
            {editingWorkout ? "Edit Workout" : "Create New Workout"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Workout Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="p-3 rounded-lg border border-gray-300 bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="p-3 rounded-lg border border-gray-300 bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="strength">Strength Training</option>
                <option value="cardio">Cardio</option>
              </select>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Exercises</h4>
              {formData.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-white/10 rounded-lg"
                >
                  <input
                    type="text"
                    placeholder="Exercise Name"
                    value={exercise.name}
                    onChange={(e) =>
                      updateExercise(index, "name", e.target.value)
                    }
                    className="p-2 rounded border border-gray-300 focus:ring-2 text-black focus:ring-blue-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Sets"
                    value={exercise.sets}
                    onChange={(e) =>
                      updateExercise(index, "sets", e.target.value)
                    }
                    className="p-2 rounded border border-gray-300 focus:ring-2 text-black focus:ring-blue-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Reps"
                    value={exercise.reps}
                    onChange={(e) =>
                      updateExercise(index, "reps", e.target.value)
                    }
                    className="p-2 rounded border border-gray-300 focus:ring-2 text-black focus:ring-blue-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Weight (kg)"
                    value={exercise.weight}
                    onChange={(e) =>
                      updateExercise(index, "weight", e.target.value)
                    }
                    className="p-2 rounded border border-gray-300 focus:ring-2 text-black focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Notes"
                      value={exercise.notes}
                      onChange={(e) =>
                        updateExercise(index, "notes", e.target.value)
                      }
                      className="p-2 rounded border border-gray-300 focus:ring-2 text-black focus:ring-blue-500 flex-1"
                    />
                    {formData.exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addExercise}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Add Exercise
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {editingWorkout ? "Update Workout" : "Create Workout"}
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

      {/* Workouts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => (
          <div
            key={workout._id}
            className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-white">
                {workout.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  workout.category === "strength"
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {workout.category}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {workout.exercises.map((exercise, index) => (
                <div key={index} className="text-sm text-gray-200">
                  <span className="font-medium">{exercise.name}</span>
                  <span className="ml-2">
                    {exercise.sets}×{exercise.reps}
                    {exercise.weight && ` @ ${exercise.weight}kg`}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(workout)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(workout._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {workouts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No workouts found. Create your first workout to get started!
          </p>
        </div>
      )}
    </div>
  );
}
