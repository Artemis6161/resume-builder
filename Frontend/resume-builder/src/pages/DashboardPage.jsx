// src/pages/DashboardPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [resume, setResume] = useState({
    fullName: "",
    role: "",
    summary: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    skills: "",
    education: "",
    experience: "",
  });
  

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleChange = (e) => {
    setResume({ ...resume, [e.target.name]: e.target.value });
  };

  const handleResumeSubmit = (e) => {
    e.preventDefault();
    alert("📄 Resume saved!");
    localStorage.setItem("resumeData", JSON.stringify(resume));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">🎯 Resume Builder</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          🚪 Logout
        </button>
      </div>

      {/* Resume Form */}
      <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto p-4">
  {/* Form Section */}
  <form
    onSubmit={handleResumeSubmit}
    className="bg-white shadow-md rounded p-6 flex-1 space-y-4"
  >
    <h2 className="text-xl font-semibold">📝 Resume Details</h2>

    <input name="fullName" placeholder="Full Name" value={resume.fullName} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
    <input name="role" placeholder="Your Role (e.g., Web Developer)" value={resume.role} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
    <textarea name="summary" placeholder="Professional Summary" value={resume.summary} onChange={handleChange} className="w-full px-4 py-2 border rounded" />

    <input name="email" placeholder="Email" value={resume.email} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
    <input name="phone" placeholder="Phone" value={resume.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
    <input name="location" placeholder="Location" value={resume.location} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
    <input name="linkedIn" placeholder="LinkedIn Profile URL" value={resume.linkedIn} onChange={handleChange} className="w-full px-4 py-2 border rounded" />

    <input name="skills" placeholder="Skills (comma-separated)" value={resume.skills} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
    <textarea name="education" placeholder="Education" value={resume.education} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
    <textarea name="experience" placeholder="Experience" value={resume.experience} onChange={handleChange} className="w-full px-4 py-2 border rounded" />

    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">💾 Save Resume</button>
  </form>

  {/* Preview Section */}
  <div className="bg-white shadow-md rounded p-6 flex-1 space-y-2">
    <h3 className="text-2xl font-bold">{resume.fullName || "Your Name"}</h3>
    <p className="text-blue-500 font-semibold">{resume.role}</p>
    <p className="text-gray-700">{resume.summary}</p>
    <hr />
    <p><strong> Email:</strong> {resume.email}</p>
    <p><strong> Phone:</strong> {resume.phone}</p>
    <p><strong> Location:</strong> {resume.location}</p>
    <p><strong> LinkedIn:</strong> <a href={resume.linkedIn} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{resume.linkedIn}</a></p>
    <p><strong> Skills:</strong> {resume.skills}</p>
    <p><strong> Education:</strong> {resume.education}</p>
    <p><strong> Experience:</strong> {resume.experience}</p>
  </div>
</div>
</div>

  );
};

export default DashboardPage;
