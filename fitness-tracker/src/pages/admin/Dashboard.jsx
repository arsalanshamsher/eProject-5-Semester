import React, { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { getToken } from "../../utils/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    workouts: [],
    nutrition: [],
    progress: [],
    recentWorkouts: [],
    recentNutrition: [],
    recentProgress: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = getToken();
      
      // Fetch all data in parallel
      const [workoutsRes, nutritionRes, progressRes] = await Promise.all([
        axios.get('http://localhost:5000/api/workouts', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/nutrition', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/progress', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const workouts = workoutsRes.data;
      const nutrition = nutritionRes.data;
      const progress = progressRes.data;

      setDashboardData({
        workouts,
        nutrition,
        progress,
        recentWorkouts: workouts.slice(0, 5),
        recentNutrition: nutrition.slice(0, 5),
        recentProgress: progress.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary statistics
  const totalWorkouts = dashboardData.workouts.length;
  const totalCalories = dashboardData.nutrition.reduce((sum, log) => {
    return sum + log.items.reduce((itemSum, item) => itemSum + (Number(item.calories) || 0), 0);
  }, 0);
  const avgCalories = totalCalories > 0 ? Math.round(totalCalories / dashboardData.nutrition.length) : 0;
  
  const latestWeight = dashboardData.progress.length > 0 ? dashboardData.progress[0].weight : null;
  const weightChange = dashboardData.progress.length > 1 ? 
    (dashboardData.progress[0].weight - dashboardData.progress[1].weight).toFixed(1) : 0;

  // Calculate workout frequency
  const thisWeekWorkouts = dashboardData.workouts.filter(workout => {
    const workoutDate = new Date(workout.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  }).length;

  // Calculate streak
  const calculateStreak = () => {
    if (dashboardData.workouts.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      
      const hasWorkout = dashboardData.workouts.some(workout => {
        const workoutDate = new Date(workout.createdAt);
        workoutDate.setHours(0, 0, 0, 0);
        return workoutDate.getTime() === checkDate.getTime();
      });
      
      if (hasWorkout) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  // Prepare chart data
  const workoutTrendData = {
    labels: dashboardData.workouts.slice(-7).map(w => new Date(w.createdAt).toLocaleDateString()),
    datasets: [{
      label: 'Workouts This Week',
      data: dashboardData.workouts.slice(-7).map(() => 1),
      borderColor: 'rgba(59, 130, 246, 0.9)',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      tension: 0.4,
      fill: true,
    }]
  };

  const nutritionTrendData = {
    labels: dashboardData.nutrition.slice(-7).map(n => new Date(n.date).toLocaleDateString()),
    datasets: [{
      label: 'Daily Calories',
      data: dashboardData.nutrition.slice(-7).map(log => 
        log.items.reduce((sum, item) => sum + (Number(item.calories) || 0), 0)
      ),
      borderColor: 'rgba(34, 197, 94, 0.9)',
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      tension: 0.4,
      fill: true,
    }]
  };

  const macroDistributionData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [
        dashboardData.nutrition.reduce((sum, log) => 
          sum + log.items.reduce((itemSum, item) => itemSum + (Number(item.protein) || 0), 0), 0
        ),
        dashboardData.nutrition.reduce((sum, log) => 
          sum + log.items.reduce((itemSum, item) => itemSum + (Number(item.carbs) || 0), 0), 0
        ),
        dashboardData.nutrition.reduce((sum, log) => 
          sum + log.items.reduce((itemSum, item) => itemSum + (Number(item.fat) || 0), 0), 0
        )
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)'
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(251, 191, 36, 1)'
      ],
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'white', font: { size: 12, weight: 'bold' } }
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
        ticks: { color: 'white', font: { size: 11, weight: '600' } },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      y: {
        ticks: { color: 'white', font: { size: 11, weight: '600' }, beginAtZero: true },
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: 'white', font: { size: 12, weight: 'bold' } }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 4,
        padding: 8,
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-8 text-white drop-shadow-md">
        Fitness Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl mb-2">🏋️</div>
          <h3 className="text-lg font-semibold text-white mb-2">Total Workouts</h3>
          <p className="text-3xl font-bold text-white">{totalWorkouts}</p>
          <p className="text-sm text-blue-200">{thisWeekWorkouts} this week</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl mb-2">🍎</div>
          <h3 className="text-lg font-semibold text-white mb-2">Total Calories</h3>
          <p className="text-3xl font-bold text-white">{totalCalories}</p>
          <p className="text-sm text-green-200">Avg: {avgCalories}/day</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl mb-2">🔥</div>
          <h3 className="text-lg font-semibold text-white mb-2">Current Streak</h3>
          <p className="text-3xl font-bold text-white">{currentStreak}</p>
          <p className="text-sm text-purple-200">days</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-md rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl mb-2">⚖️</div>
          <h3 className="text-lg font-semibold text-white mb-2">Current Weight</h3>
          <p className="text-3xl font-bold text-white">{latestWeight || 'N/A'} kg</p>
          <p className="text-sm text-orange-200">
            {weightChange > 0 ? `+${weightChange}` : weightChange < 0 ? weightChange : '0'} kg
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Workout Trend */}
        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Workout Activity (Last 7 Days)</h3>
          <div className="h-64">
            <Line data={workoutTrendData} options={chartOptions} />
          </div>
        </div>

        {/* Nutrition Trend */}
        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Daily Calorie Intake (Last 7 Days)</h3>
          <div className="h-64">
            <Line data={nutritionTrendData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Macro Distribution and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Macro Distribution</h3>
          <div className="h-48">
            <Doughnut data={macroDistributionData} options={doughnutOptions} />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activities</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {dashboardData.recentWorkouts.map((workout, index) => (
              <div key={workout._id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{workout.title}</p>
                    <p className="text-gray-300 text-sm">{workout.category}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">
                  {new Date(workout.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
            {dashboardData.recentWorkouts.length === 0 && (
              <p className="text-gray-400 text-center py-4">No recent workouts</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/admin/workouts')}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-semibold transition-colors"
          >
            🏋️ Log New Workout
          </button>
          <button 
            onClick={() => navigate('/admin/nutrition')}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-semibold transition-colors"
          >
            🍎 Log Meal
          </button>
          <button 
            onClick={() => navigate('/admin/progress')}
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg font-semibold transition-colors"
          >
            📊 Track Progress
          </button>
        </div>
      </div>

      {/* Goals and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">🏆 Achievements</h3>
          <div className="space-y-3">
            {totalWorkouts >= 10 && (
              <div className="flex items-center space-x-3 p-3 bg-yellow-500/20 rounded-lg">
                <div className="text-2xl">🥇</div>
                <div>
                  <p className="text-white font-medium">Workout Warrior</p>
                  <p className="text-gray-300 text-sm">Completed 10+ workouts</p>
                </div>
              </div>
            )}
            {currentStreak >= 7 && (
              <div className="flex items-center space-x-3 p-3 bg-orange-500/20 rounded-lg">
                <div className="text-2xl">🔥</div>
                <div>
                  <p className="text-white font-medium">Streak Master</p>
                  <p className="text-gray-300 text-sm">7+ day workout streak</p>
                </div>
              </div>
            )}
            {totalCalories >= 10000 && (
              <div className="flex items-center space-x-3 p-3 bg-green-500/20 rounded-lg">
                <div className="text-2xl">🍎</div>
                <div>
                  <p className="text-white font-medium">Nutrition Tracker</p>
                  <p className="text-gray-300 text-sm">Logged 10,000+ calories</p>
                </div>
              </div>
            )}
            {dashboardData.recentWorkouts.length === 0 && (
              <p className="text-gray-400 text-center py-4">Start your fitness journey to earn achievements!</p>
            )}
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">📈 This Month's Progress</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Workouts</span>
              <span className="text-white font-semibold">{thisWeekWorkouts}/4 weeks</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((thisWeekWorkouts / 4) * 100, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Calorie Goal</span>
              <span className="text-white font-semibold">{avgCalories}/2000 daily</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((avgCalories / 2000) * 100, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Streak Goal</span>
              <span className="text-white font-semibold">{currentStreak}/30 days</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((currentStreak / 30) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
