// ResumePage.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const SingleResume = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem("authToken"); // or wherever you're storing it
        const response = await axios.get(`http://localhost:5000/api/resumes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Resume fetched:", response.data);
        setResume(response.data);
      } catch (error) {
        console.error("Error loading resume:", error);
      }
    };

    fetchResume();
  }, [id]);

  if (!resume) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{resume.title}</h1>
      <p><strong>Profession:</strong> {resume.profession}</p>
      <p><strong>Email:</strong> {resume.email}</p>
      <p><strong>Phone:</strong> {resume.phone}</p>
      <p><strong>Summary:</strong> {resume.summary}</p>
      <p><strong>Skills:</strong> {resume.skills?.join(", ")}</p>
    </div>
  );
};

export default SingleResume;
