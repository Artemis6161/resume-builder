// pages/SingleResume.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SingleResume = () => {
  const { id } = useParams(); // ✅ Get resume ID from the URL
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`http://localhost:5000/api/resumes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResume(res.data); // ✅ Set resume data
      } catch (err) {
        console.error('Error fetching resume:', err.message);
      }
    };

    fetchResume();
  }, [id]);

  if (!resume) return <div>Loading...</div>;

  return (
    <div>
      <h1>{resume.title}</h1>
      <p>Profession: {resume.profession}</p>
      <p>Email: {resume.email}</p>
      <p>Phone: {resume.phone}</p>
      <p>Summary: {resume.summary}</p>
    </div>
  );
};

export default SingleResume;
