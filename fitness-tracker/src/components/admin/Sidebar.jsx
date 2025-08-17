import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `block px-4 py-2 rounded transition-colors duration-300 hover:bg-[var(--primary-400)] hover:text-black ${
      pathname === path || pathname.startsWith(path + "/")
        ? "bg-[var(--primary-400)] text-black shadow-lg"
        : "text-[var(--text-color)]"
    }`;

  return (
    <div
      className="
    w-64
    p-6
    bg-white/20
    dark:bg-gray-800/20
    backdrop-blur-xl
    border border-white/10
    rounded-xl
    shadow-xl
    flex flex-col justify-between
    text-[var(--text-color)]
  "
      aria-label="Sidebar"
    >
      <div className="flex justify-center items-center mb-1 relative">
        <Link to="/">
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="cursor-pointer"
            style={{ backgroundColor: "transparent" }}
          />
        </Link>
      </div>

      <nav className="space-y-4">
        <Link to="/admin" className={linkClass("/admin/dashboard")}>
          Dashboard
        </Link>
        <Link to="/admin/user" className={linkClass("/admin/user")}>
          User Profile
        </Link>
        <Link to="/admin/workouts" className={linkClass("/admin/workouts")}>
          Workouts
        </Link>
        <Link to="/admin/nutrition" className={linkClass("/admin/nutrition")}>
          Nutrition
        </Link>
        <Link to="/admin/progress" className={linkClass("/admin/progress")}>
          Progress
        </Link>
        <Link to="/admin/bmi" className={linkClass("/admin/bmi")}>
          BMI Calculator
        </Link>
        <Link to="/admin/settings" className={linkClass("/admin/settings")}>
          Preferences
        </Link>
      </nav>
      <footer className="mt-auto text-sm text-[var(--primary-light)] text-center pt-6">
        © 2025 FitTrack Inc.
      </footer>
    </div>
  );
}
