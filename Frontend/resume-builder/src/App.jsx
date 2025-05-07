// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResumeHome from "./pages/ResumeHome";
import Navbar from "./components/NavBar";
// import Dashboard from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SingleResume from "./components/singleResuma";
import "./App.css"
const App = () => {
  return (
    <Router>
     {/* <Navbar />  */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="/dashboard/:resumeId" element={<Dashboard />} /> */}
        <Route path="/resumes/:id" element={<SingleResume />} />

        <Route
          path="/resume-home"
          element={
            <ProtectedRoute>
             <ResumeHome />
            </ProtectedRoute>
          }
        />
      </Routes>
  
    
    </Router>
  );
};

export default App;
