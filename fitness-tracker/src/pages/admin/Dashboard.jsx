// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const visitorsData = {
//   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
//   datasets: [
//     {
//       label: 'Visitors',
//       data: [500, 800, 600, 1200, 900],
//       borderColor: 'var(--primary-main)',
//       backgroundColor: 'rgba(236, 164, 20, 0.2)',
//       tension: 0.4,
//       fill: true,
//       pointBackgroundColor: 'var(--primary-dark)',
//       pointBorderColor: 'var(--primary-main)',
//       borderWidth: 3,
//     },
//   ],
// };

// const workoutsData = {
//   labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
//   datasets: [
//     {
//       label: 'Workouts Completed',
//       data: [20, 25, 18, 30],
//       borderColor: 'rgba(255, 100, 0, 0.9)', 
//       backgroundColor: 'rgba(255, 100, 0, 0.2)',
//       tension: 0.3,
//       fill: true,
//       pointBackgroundColor: 'rgba(219, 78, 0, 1)',
//       pointBorderColor: 'rgba(255, 100, 0, 0.9)',
//       borderWidth: 3,
//     },
//   ],
// };

// const caloriesData = {
//   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//   datasets: [
//     {
//       label: 'Calories Burned',
//       data: [400, 600, 550, 700, 650, 800, 750],
//       borderColor: 'rgba(255, 215, 0, 0.9)', 
//       backgroundColor: 'rgba(255, 215, 0, 0.15)',
//       tension: 0.35,
//       fill: true,
//       pointBackgroundColor: 'rgba(204, 173, 0, 1)',
//       pointBorderColor: 'rgba(255, 215, 0, 0.9)',
//       borderWidth: 3,
//     },
//   ],
// };

// const heartRateData = {
//   labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
//   datasets: [
//     {
//       label: 'Heart Rate',
//       data: [65, 78, 72, 85, 75, 68],
//       borderColor: 'rgba(255, 69, 0, 0.9)', // reddish theme color
//       backgroundColor: 'rgba(255, 69, 0, 0.2)',
//       tension: 0.4,
//       fill: true,
//       pointBackgroundColor: 'rgba(204, 33, 0, 1)',
//       pointBorderColor: 'rgba(255, 69, 0, 0.9)',
//       borderWidth: 3,
//     },
//   ],
// };

// const commonOptions = {
//   responsive: true,
//   maintainAspectRatio: false, // Let chart fill container height
//   plugins: {
//     legend: {
//       labels: {
//         color: 'white',
//         font: { size: 14, weight: 'bold' },
//       },
//     },
//     tooltip: {
//       backgroundColor: 'var(--primary-dark)',
//       titleColor: 'white',
//       bodyColor: 'white',
//       cornerRadius: 4,
//       padding: 8,
//     },
//     title: { display: false },
//   },
//   scales: {
//     x: {
//       ticks: { color: 'white', font: { size: 13, weight: '600' } },
//       grid: { color: 'rgba(236, 164, 20, 0.15)' },
//     },
//     y: {
//       ticks: { color: 'white', font: { size: 13, weight: '600' }, beginAtZero: true },
//       grid: { color: 'rgba(236, 164, 20, 0.1)' },
//     },
//   },
// };

// export default function Dashboard() {
//   return (
//     <div className="p-6 max-w-7xl mx-auto" >
//       <h2 className="text-4xl font-extrabold mb-8 text-white drop-shadow-md">
//         Dashboard
//       </h2>

//       <div
//         className="
//           grid grid-cols-1 sm:grid-cols-2 gap-8
//           h-[calc(100vh-110px)]  /* Height to fit viewport minus header/margin */
//         "
//       >
//         {[ 
//           { label: 'Visitors', data: visitorsData },
//           { label: 'Workouts Completed', data: workoutsData },
//           { label: 'Calories Burned', data: caloriesData },
//           { label: 'Heart Rate', data: heartRateData },
//         ].map(({ label, data }) => (
//           <section
//             key={label}
//             className="
//               bg-white/20
//               backdrop-blur-md
//               bg-gradient-to-b from-[var(--primary-200)/40] to-[var(--primary-00)/40]
//               rounded-lg
//               shadow-lg
//               p-6
//               flex flex-col
//               "
//             aria-label={`${label} line chart`}
//           >
//             <h3 className="text-2xl font-semibold mb-4 text-white">{label}</h3>
//             <div className="flex-grow">
//               <Line data={data} options={commonOptions} />
//             </div>
//           </section>
//         ))}
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getToken } from "../../utils/auth"; // tumhara auth token getter

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [workoutsData, setWorkoutsData] = useState([]);
  const [caloriesData, setCaloriesData] = useState([]);

  useEffect(() => {
    const token = getToken();
    console.log("Auth Token:", token);
    
    // Fetch Workouts
    fetch("http://localhost:5000/api/analytics/workout", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setWorkoutsData(data.workouts || []))
      .catch(err => console.error(err));

    // Fetch Nutrition (Calories)
    fetch("http://localhost:5000/api/analytics/nutrition", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCaloriesData(data.nutrition || []))
      .catch(err => console.error(err));
  }, []);

  console.log("Nutrition Data:", caloriesData);

  // Static Visitors
  const visitorsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Visitors',
        data: [500, 800, 600, 1200, 900],
        borderColor: 'var(--primary-main)',
        backgroundColor: 'rgba(236, 164, 20, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'var(--primary-dark)',
        pointBorderColor: 'var(--primary-main)',
        borderWidth: 3,
      },
    ],
  };

  // Dynamic Workouts
  const workoutsChartData = {
    labels: workoutsData.map(item => item._id),
    datasets: [
      {
        label: 'Workouts Completed',
        data: workoutsData.map(item => item.count),
        borderColor: 'rgba(255, 100, 0, 0.9)',
        backgroundColor: 'rgba(255, 100, 0, 0.2)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: 'rgba(219, 78, 0, 1)',
        pointBorderColor: 'rgba(255, 100, 0, 0.9)',
        borderWidth: 3,
      },
    ],
  };

  // Dynamic Calories
  const caloriesChartData = {
    labels: caloriesData.map(item => item._id),
    datasets: [
      {
        label: 'Calories Burned',
        data: caloriesData.map(item => item.totalCalories),
        borderColor: 'rgba(255, 215, 0, 0.9)',
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: 'rgba(204, 173, 0, 1)',
        pointBorderColor: 'rgba(255, 215, 0, 0.9)',
        borderWidth: 3,
      },
    ],
  };

  // Static Heart Rate
  const heartRateData = {
    labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
    datasets: [
      {
        label: 'Heart Rate',
        data: [65, 78, 72, 85, 75, 68],
        borderColor: 'rgba(255, 69, 0, 0.9)',
        backgroundColor: 'rgba(255, 69, 0, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(204, 33, 0, 1)',
        pointBorderColor: 'rgba(255, 69, 0, 0.9)',
        borderWidth: 3,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white',
          font: { size: 14, weight: 'bold' },
        },
      },
      tooltip: {
        backgroundColor: 'var(--primary-dark)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 4,
        padding: 8,
      },
      title: { display: false },
    },
    scales: {
      x: {
        ticks: { color: 'white', font: { size: 13, weight: '600' } },
        grid: { color: 'rgba(236, 164, 20, 0.15)' },
      },
      y: {
        ticks: { color: 'white', font: { size: 13, weight: '600' }, beginAtZero: true },
        grid: { color: 'rgba(236, 164, 20, 0.1)' },
      },
    },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-8 text-white drop-shadow-md">
        Dashboard
      </h2>

      <div
        className="
          grid grid-cols-1 sm:grid-cols-2 gap-8
          h-[calc(100vh-110px)]
        "
      >
        {[
          { label: 'Visitors', data: visitorsData },
          { label: 'Workouts Completed', data: workoutsChartData },
          { label: 'Calories Burned', data: caloriesChartData },
          { label: 'Heart Rate', data: heartRateData },
        ].map(({ label, data }) => (
          <section
            key={label}
            className="
              bg-white/20
              backdrop-blur-md
              bg-gradient-to-b from-[var(--primary-200)/40] to-[var(--primary-00)/40]
              rounded-lg
              shadow-lg
              p-6
              flex flex-col
              "
            aria-label={`${label} line chart`}
          >
            <h3 className="text-2xl font-semibold mb-4 text-white">{label}</h3>
            <div className="flex-grow">
              <Line data={data} options={commonOptions} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
