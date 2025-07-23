import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResumeHome from "./pages/ResumeHome";
import Navbar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import SingleResume from "./components/singleResuma";
import "./App.css"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <ToastContainer position="bottom-right" autoClose={5000} />
      <Navbar />
      {/* Add padding to account for navbar height */}
      <div className="pt-20 px-4"> {/* pt-20 = padding-top: 5rem (~80px) */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/resumes/:id" element={<SingleResume  isNewResume={true}/>} />
          <Route
            path="/resume-home"
            element={
              <ProtectedRoute>
                <ResumeHome />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
