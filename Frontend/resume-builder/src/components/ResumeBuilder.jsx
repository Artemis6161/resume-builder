// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";

// import Template1Preview from "../components/templates/Template1Preview";
// import Template2Preview from "../components/templates/Template2Preview";
// import Template3Preview from "../components/templates/Template3Preview";
// const ResumeBuilder = () => {
//   const [selectedTemplate, setSelectedTemplate] = useState("Template 1");

//   const handleTemplateChange = (e) => {
//     setSelectedTemplate(e.target.value);
//   };
//   const [formData, setFormData] = useState({
//     heading: "",
//     summary: "",
//     education: [{ university: "", degree: "", place: "", fromYear: "", toYear: "" }],
//     skills: "",
//     experience: [{ company: "", role: "", place: "", fromYear: "", toYear: "", currentlyWorking: false, description: "" }],
//     certifications: "",
//     languages: "",
//     email: "",
//     phone: "",
//     linkedIn: "",
//     github: "",
//     portfolio: "",
//   });
//   const { resumeId } = useParams();
  

//   useEffect(() => {
//     const fetchResume = async () => {
//       try {
//         const token = localStorage.getItem("authToken");

//         const response = await axios.get(
//           `http://localhost:5000/api/resumes${resumeId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setFormData(response.data);
//       } catch (error) {
//         console.error("Error fetching resume:", error);
//       }
//     };

//     fetchResume();
//   }, [resumeId]);
//   const handleInputChange = (e, section, index = null, field = null) => {
//     const value = e.target.value;
//     const updatedData = { ...formData };
  
//     if (index !== null && field !== null) {
//       if (Array.isArray(updatedData[section]) && updatedData[section][index]) {
//         updatedData[section][index][field] = value;
//         console.log('Updating:', { section, index, field, value });
//       }
//     } else {
//       if (updatedData.hasOwnProperty(section)) {
//         updatedData[section] = value;
//       }
//     }
  
//     setFormData(updatedData);
//   };
  

//   const addField = (section) => {
//     const updatedData = { ...formData };
//     if (section === "education") {
//       updatedData[section].push({ university: "", degree: "", place: "", fromYear: "", toYear: "" });
//     } else if (section === "experience") {
//       updatedData[section].push({ company: "", role: "", place: "", fromYear: "", toYear: "", currentlyWorking: false, description: "" });
//     }
//     setFormData(updatedData);
//   };

//   const deleteField = (section, index) => {
//     const updatedData = { ...formData };
//     updatedData[section].splice(index, 1);
//     setFormData(updatedData);
//   };

//   const handleSubmit = () => {
//     alert("Resume submitted!");
//   };

//   return (
//     <div className="flex space-x-6 p-8 bg-gray-100">
//      <div style={{ padding: "20px" }}>
//       <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>

//       {/* Template Selector */}
//       <div style={{ marginBottom: "30px" }}>
//         <label
//           htmlFor="template-select"
//           style={{ marginRight: "10px", fontWeight: "bold", fontSize: "16px" }}
//         >
//           Choose Resume Template:
//         </label>

//         <select
//           id="template-select"
//           value={selectedTemplate}
//           onChange={handleTemplateChange}
//           style={{
//             padding: "10px",
//             borderRadius: "6px",
//             border: "1px solid #ccc",
//             fontSize: "16px",
//           }}
//         >
//           <option value="Template 1">Template 1 - Classic</option>
//           <option value="Template 2">Template 2 - Professional</option>
//           <option value="Template 3">Template 3 - Modern</option>
//         </select>
//       </div>

//       {/* Template Preview */}
//       <div className="w-1/3 p-6 bg-white rounded-lg shadow-lg space-y-4">
//           <h2 className="text-2xl font-semibold">Resume Preview</h2>

         
//           {selectedTemplate === "Template 1" && <Template1Preview formData={formData} />}
//           {selectedTemplate === "Template 2" && <Template2Preview formData={formData} />}
//           {selectedTemplate === "Template 3" && <Template3Preview formData={formData} />}
//         </div>

//     </div>
  
//       {/* Left Section: Form Inputs */}
//       <div className="w-2/3 space-y-6">
//         <h1 className="text-3xl font-semibold">Create Your Modern Resume</h1>

//         {/* Personal Info */}
//         <div className="space-y-4">
//           <h2 className="text-xl font-semibold">Personal Information</h2>
//           <input
//             type="text"
//             className="w-full p-2 border border-gray-300 rounded-md"
//             placeholder="Full Name"
//             value={formData.heading}
//             onChange={(e) => handleInputChange(e, "heading")}
//           />
        //   <input
        //     type="email"
        //     className="w-full p-2 border border-gray-300 rounded-md"
        //     placeholder="Email"
        //     value={formData.email}
        //     onChange={(e) => handleInputChange(e, "email")}
        //   />
//           <input
//             type="number"
//             className="w-full p-2 border border-gray-300 rounded-md"
//             placeholder="Phone Number"
//             value={formData.phone}
//             onChange={(e) => handleInputChange(e, "phone")}
//           />
//           <input
//             type="text"
//             className="w-full p-2 border border-gray-300 rounded-md"
//             placeholder="LinkedIn"
//             value={formData.linkedIn}
//             onChange={(e) => handleInputChange(e, "linkedIn")}
//           />
//           <input
//             type="text"
//             className="w-full p-2 border border-gray-300 rounded-md"
//             placeholder="GitHub"
//             value={formData.github}
//             onChange={(e) => handleInputChange(e, "github")}
//           />
//           <input
//             type="text"
//             className="w-full p-2 border border-gray-300 rounded-md"
//             placeholder="Portfolio"
//             value={formData.portfolio}
//             onChange={(e) => handleInputChange(e, "portfolio")}
//           />
//         </div>

//         {/* Summary Section */}
//         <div>
//           <h2 className="text-xl font-semibold">Summary</h2>
//           <textarea
//             className="w-full p-2 border border-gray-300 rounded-md"
//             placeholder="Write a brief summary about yourself"
//             value={formData.summary}
//             onChange={(e) => handleInputChange(e, "summary")}
//           />
//         </div>

//         {/* Education Section */}
//         <div>
//           <h2 className="text-xl font-semibold">Education</h2>
//           {formData.education.map((edu, index) => (
//             <div key={index} className="space-y-4">
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="University"
//                 value={edu.university}
//                 onChange={(e) => handleInputChange(e, "education", index, "university")}
//               />
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="Degree"
//                 value={edu.degree}
//                 onChange={(e) => handleInputChange(e, "education", index, "degree")}
//               />
//               <div className="flex justify-between">
//                 <input
//                   type="text"
//                   className="w-1/2 p-2 border border-gray-300 rounded-md"
//                   placeholder="Place"
//                   value={edu.place}
//                   onChange={(e) => handleInputChange(e, "education", index, "place")}
//                 />
//                 <div className="flex space-x-2">
//                   <input
//                     type="text"
//                     className="w-1/4 p-2 border border-gray-300 rounded-md"
//                     placeholder="From Year"
//                     value={edu.fromYear}
//                     onChange={(e) => handleInputChange(e, "education", index, "fromYear")}
//                   />
//                   <input
//                     type="text"
//                     className="w-1/4 p-2 border border-gray-300 rounded-md"
//                     placeholder="To Year"
//                     value={edu.toYear}
//                     onChange={(e) => handleInputChange(e, "education", index, "toYear")}
//                   />
//                 </div>
//               </div>
//               <button
//                 className="text-red-600 mt-2"
//                 onClick={() => deleteField("education", index)}
//               >
//                 Delete Education
//               </button>
//             </div>
//           ))}
//           <button
//             onClick={() => addField("education")}
//             className="text-blue-600 underline mt-4"
//           >
//             + Add Education
//           </button>
//         </div>

//         {/* Experience Section */}
//         <div>
//           <h2 className="text-xl font-semibold">Experience</h2>
//           {formData.experience.map((exp, index) => (
//             <div key={index} className="space-y-4">
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="Company"
//                 value={exp.company}
//                 onChange={(e) => handleInputChange(e, "experience", index, "company")}
//               />
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="Role"
//                 value={exp.role}
//                 onChange={(e) => handleInputChange(e, "experience", index, "role")}
//               />
//               <div className="flex justify-between">
//                 <input
//                   type="text"
//                   className="w-1/2 p-2 border border-gray-300 rounded-md"
//                   placeholder="Place"
//                   value={exp.place}
//                   onChange={(e) => handleInputChange(e, "experience", index, "place")}
//                 />
//                 <div className="flex space-x-2">
//                   <input
//                     type="text"
//                     className="w-1/4 p-2 border border-gray-300 rounded-md"
//                     placeholder="From Year"
//                     value={exp.fromYear}
//                     onChange={(e) => handleInputChange(e, "experience", index, "fromYear")}
//                   />
//                   <input
//                     type="text"
//                     className="w-1/4 p-2 border border-gray-300 rounded-md"
//                     placeholder="To Year"
//                     value={exp.toYear}
//                     onChange={(e) => handleInputChange(e, "experience", index, "toYear")}
//                     disabled={exp.currentlyWorking}
//                   />
//                 </div>
//               </div>
//               <textarea
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="Describe your role and responsibilities"
//                 value={exp.description}
//                 onChange={(e) => handleInputChange(e, "experience", index, "description")}
//               />
//               <label className="block">
//                 <input
//                   type="checkbox"
//                   checked={exp.currentlyWorking}
//                   onChange={(e) => handleInputChange(e, "experience", index, "currentlyWorking")}
//                 />
//                 Currently Working
//               </label>
//               <button
//                 className="text-red-600 mt-2"
//                 onClick={() => deleteField("experience", index)}
//               >
//                 Delete Experience
//               </button>
              
//             </div>

//           ))}
//           <button
//             onClick={() => addField("experience")}
//             className="text-blue-600 underline mt-4"
//           >
//             + Add Experience
//           </button>
//         </div>
// {/* Certifications Section */}
// <div>
//   <h2 className="text-xl font-semibold">Certifications</h2>
//   <textarea
//     className="w-full p-2 border border-gray-300 rounded-md"
//     placeholder="List your certifications separated by commas"
//     value={formData.certifications}
//     onChange={(e) => handleInputChange(e, "certifications")}
//   />
// </div>

// {/* Languages Section */}
// <div>
//   <h2 className="text-xl font-semibold">Languages</h2>
//   <textarea
//     className="w-full p-2 border border-gray-300 rounded-md"
//     placeholder="List languages you speak separated by commas"
//     value={formData.languages}
//     onChange={(e) => handleInputChange(e, "languages")}
//   />
// </div>

//         {/* Submit Button */}
//         <button
//           onClick={handleSubmit}
//           className="w-full bg-blue-500 text-white py-2 rounded-md mt-8"
//         >
//           Submit
//         </button>
     
//       </div>
//      {/* Right Section: Resume Preview */}
// <div className="w-1/3 p-6 bg-white rounded-lg shadow-lg space-y-4">
//   <h2 className="text-2xl font-semibold">Resume Preview</h2>
  
//   {/* Personal Information Preview */}
//   <div className="border-b-2 pb-4">
//     <div className="text-xl font-bold">{formData.heading}</div>
//     <div>{formData.summary}</div>
    // <div>{formData.email}</div>
    // <div>{formData.phone}</div>

//     {/* LinkedIn, GitHub, Portfolio with only the username */}
//     {formData.linkedIn && (
//       <div>
//         <a href={`https://www.linkedin.com/in/${formData.linkedIn}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">
//           {formData.linkedIn}
//         </a>
//       </div>
//     )}

//     {formData.github && (
//       <div>
//         <a href={`https://github.com/${formData.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">
//           {formData.github}
//         </a>
//       </div>
//     )}

//     {formData.portfolio && (
//       <div>
//         <a href={formData.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600">
//           Portfolio
//         </a>
//       </div>
//     )}
//   </div>

//   {/* Education Preview */}
//   <div>
//     <h3 className="text-xl font-semibold">Education</h3>
//     {formData.education.map((edu, index) => (
//       <div key={index} className="space-y-2">
//         <div className="font-medium">{edu.university}</div>
//         <div className="italic">{edu.degree}</div>
//         <div>{edu.place}</div>
//         <div>{edu.fromYear} - {edu.toYear}</div>
//       </div>
//     ))}
//   </div>

//   {/* Experience Preview */}
//   <div>
//     <h3 className="text-xl font-semibold">Experience</h3>
//     {formData.experience.map((exp, index) => (
//       <div key={index} className="space-y-2">
//         <div>{exp.company} - {exp.role}</div>
//         <div>{exp.place}</div>
//         <div>{exp.fromYear} - {exp.toYear}</div>
//         <div>{exp.description}</div>
//       </div>
//     ))}
//   </div>

//   {/* Additional Sections */}
//   <div>
//     <h3 className="text-xl font-semibold">Skills</h3>
//     <div>{formData.skills}</div>
//   </div>

//   <div>
//     <h3 className="text-xl font-semibold">Certifications</h3>
//     <div>{formData.certifications}</div>
//   </div>

//   <div>
//     <h3 className="text-xl font-semibold">Languages</h3>
//     <div>{formData.languages}</div>
//   </div>
// </div>
// </div>
//   )         

// };

// export default ResumeBuilder;
