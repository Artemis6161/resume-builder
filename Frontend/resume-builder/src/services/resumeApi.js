import axios from 'axios';
const API_BASE = "http://localhost:5000/api/resumes";
export const getResumeById = async (id, token) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to load resume');
  }
  return await response.json();
};

export const saveResume = async (resume, token) => {
  const headers = { Authorization: `Bearer ${token}` };
  
  if (resume._id) {
    const res = await axios.put(`http://localhost:5000/api/resumes/${resume._id}`, resume, { headers });
    return res.data;
  } else {
    const res = await axios.post(`http://localhost:5000/api/resumes`, resume, { headers });
    return res.data;
  }
};


// Add other API calls as needed
export const getResumes = async (token) => {
  const response = await fetch(API_BASE, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};