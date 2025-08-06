import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

export default function AdminLayout() {
  const location = useLocation();

  useEffect(() => {
    AOS.refresh();
  }, [location]);

  return (
    <div
      className="flex min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1601597111515-79b41fe7c5b7?auto=format&fit=crop&w=1740&q=80)',
      }}
    >
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100/70 dark:bg-gray-500/70 backdrop-blur-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold"></h1>
          <ThemeToggle />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
