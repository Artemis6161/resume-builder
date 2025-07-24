// src/components/RegisterForm.jsx
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://resume-builder-frontend-u8i8.onrender.com/auth/register", formData);
      alert("✅ Registered successfully");
      
  
        // ✅ Redirect after login
        navigate("/login");
    } catch (err) {
      alert("❌ Error: " + err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-full max-w-sm"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <input
        className="input w-full mb-3 px-4 py-2 border rounded"
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
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
        Register
      </button>
      <p className="text-center mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
      </p>
    </form>
  </div>
  );
};

export default RegisterForm;
