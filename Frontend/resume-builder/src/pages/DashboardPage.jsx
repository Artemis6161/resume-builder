// src/pages/DashboardPage.jsx
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div>
      <h1>🏠 Dashboard</h1>
      <p>Welcome to your resume builder dashboard!</p>
      <button onClick={handleLogout}>🚪 Logout</button>
    </div>
  );
};

export default DashboardPage;
