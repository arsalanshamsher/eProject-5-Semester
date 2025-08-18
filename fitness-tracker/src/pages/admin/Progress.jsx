import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/auth';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Progress() {
  const [progressData, setProgressData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    muscleMass: '',
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    thighs: '',
    notes: ''
  });

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://localhost:5000/api/progress', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgressData(response.data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (editingEntry) {
        await axios.put(`http://localhost:5000/api/progress/${editingEntry._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/progress', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchProgressData();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving progress entry:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this progress entry?')) {
      try {
        const token = getToken();
        await axios.delete(`http://localhost:5000/api/progress/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProgressData();
      } catch (error) {
        console.error('Error deleting progress entry:', error);
      }
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      date: new Date(entry.date).toISOString().split('T')[0],
      weight: entry.weight || '',
      bodyFat: entry.bodyFat || '',
      muscleMass: entry.muscleMass || '',
      chest: entry.chest || '',
      waist: entry.waist || '',
      hips: entry.hips || '',
      biceps: entry.biceps || '',
      thighs: entry.thighs || '',
      notes: entry.notes || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      bodyFat: '',
      muscleMass: '',
      chest: '',
      waist: '',
      hips: '',
      biceps: '',
      thighs: '',
      notes: ''
    });
    setEditingEntry(null);
  };

  const prepareChartData = (field, label, color) => {
    const sortedData = [...progressData].sort((a, b) => new Date(a.date) - new Date(b.date));
    return {
      labels: sortedData.map(entry => new Date(entry.date).toLocaleDateString()),
      datasets: [{
        label,
        data: sortedData.map(entry => entry[field]).filter(val => val !== '' && val !== null),
        borderColor: color,
        backgroundColor: color + '20',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        borderWidth: 3,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'white', font: { size: 14, weight: 'bold' } }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 4,
        padding: 8,
      }
    },
    scales: {
      x: {
        ticks: { color: 'white', font: { size: 13, weight: '600' } },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      y: {
        ticks: { color: 'white', font: { size: 13, weight: '600' }, beginAtZero: true },
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    }
  };

  const getLatestValue = (field) => {
    if (progressData.length === 0) return 'N/A';
    const latest = progressData.reduce((latest, current) => 
      new Date(current.date) > new Date(latest.date) ? current : latest
    );
    return latest[field] || 'N/A';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-extrabold text-white drop-shadow-md">
          Progress Tracking
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Log Progress
        </button>
      </div>

      {/* Progress Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Current Weight</h3>
          <p className="text-3xl font-bold text-white">{getLatestValue('weight')} kg</p>
        </div>
        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Body Fat %</h3>
          <p className="text-3xl font-bold text-white">{getLatestValue('bodyFat')}%</p>
        </div>
        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Muscle Mass</h3>
          <p className="text-3xl font-bold text-white">{getLatestValue('muscleMass')} kg</p>
        </div>
        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Total Entries</h3>
          <p className="text-3xl font-bold text-white">{progressData.length}</p>
        </div>
      </div>

      {/* Progress Form */}
      {showForm && (
        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-white">
            {editingEntry ? 'Edit Progress Entry' : 'Log New Progress'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="p-3 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                step="0.1"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                className="p-3 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Body Fat %"
                value={formData.bodyFat}
                onChange={(e) => setFormData(prev => ({ ...prev, bodyFat: e.target.value }))}
                className="p-3 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Muscle Mass (kg)"
                value={formData.muscleMass}
                onChange={(e) => setFormData(prev => ({ ...prev, muscleMass: e.target.value }))}
                className="p-3 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="number"
                step="0.1"
                placeholder="Chest (cm)"
                value={formData.chest}
                onChange={(e) => setFormData(prev => ({ ...prev, chest: e.target.value }))}
                className="p-3 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Waist (cm)"
                value={formData.waist}
                onChange={(e) => setFormData(prev => ({ ...prev, waist: e.target.value }))}
                className="p-3 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Hips (cm)"
                value={formData.hips}
                onChange={(e) => setFormData(prev => ({ ...prev, hips: e.target.value }))}
                className="p-3 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Biceps (cm)"
                value={formData.biceps}
                onChange={(e) => setFormData(prev => ({ ...prev, biceps: e.target.value }))}
                className="p-3 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Thighs (cm)"
                value={formData.thighs}
                onChange={(e) => setFormData(prev => ({ ...prev, thighs: e.target.value }))}
                className="p-3 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <textarea
              placeholder="Notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full p-3 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows="3"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {editingEntry ? 'Update Entry' : 'Log Progress'}
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

      {/* Progress Charts */}
      {progressData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Weight Progress</h3>
            <div className="h-64">
              <Line data={prepareChartData('weight', 'Weight (kg)', 'rgba(147, 51, 234, 0.9)')} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Body Fat Progress</h3>
            <div className="h-64">
              <Line data={prepareChartData('bodyFat', 'Body Fat %', 'rgba(239, 68, 68, 0.9)')} options={chartOptions} />
            </div>
          </div>
        </div>
      )}

      {/* Progress Entries List */}
      <div className="space-y-4">
        {progressData.map((entry) => (
          <div key={entry._id} className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-white">
                {new Date(entry.date).toLocaleDateString()}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(entry)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entry._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              {entry.weight && <div className="text-center"><span className="text-gray-400">Weight:</span><br /><span className="text-white font-semibold">{entry.weight} kg</span></div>}
              {entry.bodyFat && <div className="text-center"><span className="text-gray-400">Body Fat:</span><br /><span className="text-white font-semibold">{entry.bodyFat}%</span></div>}
              {entry.muscleMass && <div className="text-center"><span className="text-gray-400">Muscle:</span><br /><span className="text-white font-semibold">{entry.muscleMass} kg</span></div>}
              {entry.chest && <div className="text-center"><span className="text-gray-400">Chest:</span><br /><span className="text-white font-semibold">{entry.chest} cm</span></div>}
              {entry.waist && <div className="text-center"><span className="text-gray-400">Waist:</span><br /><span className="text-white font-semibold">{entry.waist} cm</span></div>}
            </div>

            {entry.notes && (
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-gray-300 text-sm">{entry.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {progressData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No progress entries found. Start logging your progress to track your fitness journey!</p>
        </div>
      )}
    </div>
  );
}
