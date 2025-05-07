// Template1Preview.js
import React from "react";

const Template1Preview = ({ formData }) => {
  
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>{formData.heading}</h1>
      <h3>{formData.summary}</h3>
      <div style={{ marginTop: "10px", fontSize: "14px", textAlign: "center" }}>
        {formData.email && <span>Email: {formData.email} | </span>}
        {formData.phone && <span>Phone: {formData.phone} | </span>}
        {formData.linkedIn && <span>LinkedIn: {formData.linkedIn} | </span>}
        {formData.github && <span>GitHub: {formData.github} | </span>}
        {formData.portfolio && <span>Portfolio: {formData.portfolio}</span>}
      </div>

      <section>
        <h2>Education</h2>
        {formData.education.map((edu, index) => (
          <div key={index}>
            <h4>{edu.degree} from {edu.university} ({edu.fromYear} - {edu.toYear})</h4>
            <p>{edu.place}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Skills</h2>
        <p>{formData.skills}</p>
      </section>

      <section>
        <h2>Experience</h2>
        {formData.experience.map((exp, index) => (
          <div key={index}>
            <h4>{exp.role} at {exp.company} ({exp.fromYear} - {exp.toYear})</h4>
            <p>{exp.description}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Contact</h2>
        <p>Email: {formData.email}</p>
        <p>Phone: {formData.phone}</p>
        <p>LinkedIn: {formData.linkedIn}</p>
        <p>GitHub: {formData.github}</p>
        <p>Portfolio: {formData.portfolio}</p>
      </section>
    </div>
  );
};

export default Template1Preview;
