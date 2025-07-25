import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateResumeModal from '../components/CreateResumeModal';
import axios from 'axios';

// Define your backend API base URL here
// It's best practice to use an environment variable for this
// For now, we'll hardcode it for demonstration, but ideally, you'd use:
// const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL; // if using Vite and .env
// or process.env.REACT_APP_BACKEND_URL; // if using Create React App and .env

const API_BASE_URL = 'https://resume-builder-backend-suc5.onrender.com'; // <--- CORRECTED BACKEND URL

const ResumeHome = () => {
  const [resumes, setResumes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        console.log("Sending token:", token);
        if (!token) {
          navigate('/login');
          return;
        }

        // CORRECTED API CALL: Use API_BASE_URL + /api/resumes
        const res = await axios.get(`${API_BASE_URL}/api/resumes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResumes(res.data.resumes || []);
      } catch (err) {
        console.error('Error fetching resumes:', err);
        setError(err.response?.data?.message || 'Failed to fetch resumes');
        if (err.response?.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [navigate]);

const handleCreateResume = async (title) => {
  try {
    const token = localStorage.getItem('authToken');

    // Clear any existing draft before creating new resume
    localStorage.removeItem('resumeDraft');

    // CORRECTED API CALL: Use API_BASE_URL + /api/resumes
    const res = await axios.post(
      `${API_BASE_URL}/api/resumes`,
      {
        title,
        profession: 'Developer',
        email: '',
        phone: '',
        summary: '',
        education: [],
        experience: [],
        skills: []
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setResumes(prev => [...prev, res.data]);
    navigate(`/resumes/${res.data._id}`);
    setModalOpen(false);
  } catch (err) {
    console.error('Failed to create resume:', err);
    setError(err.response?.data?.message || 'Failed to create resume');
  }
};

  const handleDeleteResume = async (resumeId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('authToken');
      // CORRECTED API CALL: Use API_BASE_URL + /api/resumes/:id
      await axios.delete(`${API_BASE_URL}/api/resumes/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes(prev => prev.filter(r => r._id !== resumeId));
    } catch (err) {
      console.error('Delete failed:', err);
      setError(err.response?.data?.message || 'Failed to delete resume');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button
            onClick={() => setError(null)}
            className="absolute top-0 right-0 px-2 py-1"
          >
            &times;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Resumes</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          >
            Create Resume
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Modal */}
      <CreateResumeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateResume}
      />

      {/* Resume Cards */}
      {resumes.length === 0 ? (
        <div className="text-center mt-12">
          <p className="text-gray-500 text-lg mb-4">You don't have any resumes yet</p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          >
            Create Your First Resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              onClick={() => navigate(`/resumes/${resume._id}`)}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer h-48 flex flex-col"
            >
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{resume.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {resume.profession || 'No profession specified'}
                  </p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/resumes/${resume._id}`);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDeleteResume(resume._id, e)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeHome;