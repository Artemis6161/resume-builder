// Template2Preview.js
import React from "react";

const Template2Preview = ({ formData }) => {
  return (
    <div style={{ padding: "20px", fontFamily: "Helvetica, sans-serif" }}>
      <h1>{formData.heading}</h1>
      <p>{formData.summary}</p>

      <section>
        <h3>Education</h3>
        {formData.education.map((edu, index) => (
          <div key={index}>
            <h5>{edu.degree} from {edu.university} ({edu.fromYear} - {edu.toYear})</h5>
            <p>{edu.place}</p>
          </div>
        ))}
      </section>

      <section>
        <h3>Experience</h3>
        {formData.experience.map((exp, index) => (
          <div key={index}>
            <h5>{exp.role} at {exp.company} ({exp.fromYear} - {exp.toYear})</h5>
            <p>{exp.description}</p>
          </div>
        ))}
      </section>

      <section>
        <h3>Skills</h3>
        <p>{formData.skills}</p>
      </section>

      <section>
        <h3>Contact</h3>
        <p>Email: {formData.email}</p>
        <p>Phone: {formData.phone}</p>
        <p>LinkedIn: {formData.linkedIn}</p>
        <p>GitHub: {formData.github}</p>
        <p>Portfolio: {formData.portfolio}</p>
      </section>
    </div>
  );
};

export default Template2Preview;
