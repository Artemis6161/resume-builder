// http://localhost:5000/api/resumes

// pages/Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateResumeModal from '../components/CreateResumeModal';
import axios from 'axios';
import { useEffect } from 'react';

const ResumeHome = () => {
  const [resumes, setResumes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('http://localhost:5000/api/resumes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResumes(res.data.resumes); // ✅ assumes your backend sends { resumes: [...] }
      } catch (err) {
        console.error('Error fetching resumes:', err.message);
      }
    };
  
    fetchResumes();
  }, []);
 
  const handleCreateResume = async (title) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
        'http://localhost:5000/api/resumes',
        {
          title: title, // previously 'name'
          profession: 'Developer',
          email: '', // optional or real value
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
      
      const newResumeId = res.data._id;
      navigate(`/resumes/${newResumeId}`);
      setResumes((prev) => [...prev, res.data]); 
      setModalOpen(false);
     
    } catch (err) {
      console.error('Failed to create resume:', err.message);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // If you stored userId
    localStorage.removeItem('userName'); // If you stored userName
    navigate('/login');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-600 text-white px-6 py-2 rounded shadow"
      >
        Create Resume
      </button>
      <button onClick={handleLogout} 
           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
           >
        Logout
      </button>
      <CreateResumeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateResume}
      />
      {resumes.length === 0 ? (
  <p>No resumes found.</p>
) : (
  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
    {Array.isArray(resumes) &&resumes.map((resume) => (
      <div
        key={resume._id || resume.title}
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
          minWidth: '150px',
          cursor: 'pointer',
          backgroundColor: '#f9f9f9',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={() => navigate(`/resumes/${resume._id}`)}
      >
        <h3>{resume.title}</h3>
      </div>
    ))}
  </div>
)}
 </div>
</div>
    
  );
};

export default ResumeHome;


