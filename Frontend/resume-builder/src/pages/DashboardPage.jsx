// src/pages/DashboardPage.jsx
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Resume Builder</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </nav>

      {/* Dashboard Content */}
      <div className="p-8">
        <h2 className="text-3xl font-semibold mb-2">🏠 Dashboard</h2>
        <p className="text-gray-600">Welcome to your resume builder dashboard!</p>
      </div>
    </div>
  );
};

export default DashboardPage;
