import { useState } from "react";

const DashboardPage = () => {
  const [resume, setResume] = useState({
    fullName: "",
    role: "",
    summary: "",
  });

  const handleChange = (e) => {
    setResume({ ...resume, [e.target.name]: e.target.value });
  };

  const handleResumeSubmit = (e) => {
    e.preventDefault();
    console.log("Resume Submitted:", resume);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">📝 Resume Details</h2>
      <form onSubmit={handleResumeSubmit} className="space-y-4 max-w-md">
        <input
          name="fullName"
          placeholder="Full Name"
          value={resume.fullName}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          name="role"
          placeholder="Your Role (e.g., Web Developer)"
          value={resume.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <textarea
          name="summary"
          placeholder="Professional Summary"
          value={resume.summary}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Resume
        </button>
      </form>

      {/* Preview */}
      <div className="mt-6 p-4 border rounded shadow-md">
        <h3 className="text-xl font-bold">{resume.fullName}</h3>
        <p className="text-blue-500 font-semibold">{resume.role}</p>
        <p className="mt-2">{resume.summary}</p>
      </div>
    </div>
  );
};

export default DashboardPage;
