// src/components/LoginForm.jsx
import { useState } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
   if (!email || !password) {
      toast("Please enter both email and password");
      return;
    }
  try {
    const res = await axios.post(
      "https://resume-builder-backend-suc5.onrender.com/api/auth/login",
      formData,
      { headers: { "Content-Type": "application/json" } }
    );
       toast("✅  Login Successful");
    // alert("✅ Logged in");
    localStorage.setItem("authToken", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    navigate("/resume-home");
  } catch (err) {
    toast("❌ Error: " + (err.response?.data?.message || "Login failed"));
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          className="input w-full mb-3 px-4 py-2 border rounded"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          className="input w-full mb-3 px-4 py-2 border rounded"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
