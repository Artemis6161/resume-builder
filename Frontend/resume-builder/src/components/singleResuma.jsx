import React, { useState, useRef, useEffect} from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import ResumePreview from '../components/templates/ResumePreview';
import html2pdf from 'html2pdf.js';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import Spinner from '../components/Spinner';
import { useParams } from 'react-router-dom';
import { convertFromHTML } from 'draft-js';
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { saveResume, getResumeById } from '../services/resumeApi';

// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
const ResumeForm = () => {
   const { id } = useParams();
   const previewRef = useRef();
   const resumeRef = useRef();
  const [step, setStep] = useState(0);

  const [currentSuggestion, setCurrentSuggestion] = useState();
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
   const [saving, setSaving] = useState(false);
  const [resume, setResume] = useState({
  title: '',
  profession: '',
  summary: '',
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  portfolio: '',
  location:'',
  education: [{ degree: '', institution: '', from: '', to: '', currentlyStudying: false }],
  skills: [''],
  experience: [{ company: '', role: '', from: '', to: '', currentlyWorking: false, description: '' }],
  projects: [{ title: '', link: '', description: '', from: '', to: '', technology: '' }],
  certifications: [''],
  languages: [''],
  aiSuggestions: {
    experience: [],
    projects: []
  }
});
const [editorStates, setEditorStates] = useState([EditorState.createEmpty()]);
const [projectEditorStates, setProjectEditorStates] = useState([EditorState.createEmpty()]);

const handleEditorChange = (index, state) => {
  const rawContent = convertToRaw(state.getCurrentContent());
  const htmlContent = draftToHtml(rawContent); // ✅ Convert to HTML

  const updatedExperience = [...resume.experience];
  updatedExperience[index].summary = htmlContent; // ✅ Save HTML here

  setResume(prev => ({
    ...prev,
    experience: updatedExperience,
  }));

  const updatedEditorStates = [...editorStates];
  updatedEditorStates[index] = state;
  setEditorStates(updatedEditorStates);
};

const initialResumeState = {
  title: '',
  profession: '',
  summary: '',
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  portfolio: '',
   location:'',
  education: [{ degree: '', institution: '', from: '', to: '', currentlyStudying: false }],
  skills: [''],
  experience: [{ company: '', role: '', from: '', to: '', currentlyWorking: false, summary: '' }],
  projects: [{ title: '', link: '', description: '', from: '', to: '', technology: '' }],
  certifications: [''],
  languages: [''],
  aiSuggestions: { experience: [], projects: [] }
};

 useEffect(() => {
  const loadResume = async () => {
    const token = localStorage.getItem('authToken');
    if (!token || !id) return; // 👈 use id from URL

    try {
      const loadedResume = await getResumeById(id, token);
     setResume({
  ...initialResumeState,
  ...loadedResume,
  // Fallbacks in case data is empty:
  skills: loadedResume.skills?.length ? loadedResume.skills : [''],
  education: loadedResume.education?.length ? loadedResume.education : [{ degree: '', institution: '', from: '', to: '', currentlyStudying: false }],
  experience: loadedResume.experience?.length ? loadedResume.experience : [{ company: '', role: '', from: '', to: '', currentlyWorking: false, summary: '' }],
  projects: loadedResume.projects?.length ? loadedResume.projects : [{ title: '', link: '', description: '', from: '', to: '', technology: '' }],
  certifications: loadedResume.certifications?.length ? loadedResume.certifications : [''],
  languages: loadedResume.languages?.length ? loadedResume.languages : [''],

});


      // Initialize experience editors
      const newExperienceEditorStates = loadedResume.experience.map(exp => {
        if (exp.summary) {
          const blocks = convertFromHTML(exp.summary);
          const contentState = ContentState.createFromBlockArray(
            blocks.contentBlocks,
            blocks.entityMap
          );
          return EditorState.createWithContent(contentState);
        }
        return EditorState.createEmpty();
      });
      setEditorStates(newExperienceEditorStates);

      // Initialize project editors (THIS WAS MISSING)
      const newProjectEditorStates = loadedResume.projects.map(proj => {
        if (proj.description) {
          const blocks = convertFromHTML(proj.description);
          const contentState = ContentState.createFromBlockArray(
            blocks.contentBlocks,
            blocks.entityMap
          );
          return EditorState.createWithContent(contentState);
        }
        return EditorState.createEmpty();
      });
      setProjectEditorStates(newProjectEditorStates);

    } catch (error) {
      console.error('Load error:', error);
    }
  };

  loadResume();
}, [resume._id]); // Re-run when ID changes

// console.log('Data being sent:', JSON.stringify(resumeToSave, null, 2));
console.log('Editor states:', editorStates);
console.log('Project editor states:', projectEditorStates);
console.log('Token exists:', !!localStorage.getItem('authToken'));

const handleSaveResume = async () => {
  console.log("Saving resume ID:", resume._id);

  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error("Token missing");
          toast("Token missing");
    return;
  }

  try {
    setSaving(true);

    // Convert experience editor states to HTML and update resume.experience summaries
  const updatedExperience = resume.experience.map((exp, index) => {
  const state = editorStates[index];
  if (!state) return exp; // Skip if undefined

  const rawContent = convertToRaw(state.getCurrentContent());
  const htmlContent = draftToHtml(rawContent);
  return { ...exp, summary: htmlContent };
});

    // Convert project editor states to HTML and update resume.projects descriptions
    const updatedProjects = resume.projects.map((proj, index) => {
      const state = projectEditorStates[index];
      if (!state) return proj; // Skip if undefined

      const rawContent = convertToRaw(state.getCurrentContent());
      const htmlContent = draftToHtml(rawContent);
      return { ...proj, description: htmlContent };
    });


    const updatedResume = { ...resume, experience: updatedExperience, projects: updatedProjects }; // Include updatedProjects
    const savedResume = await saveResume(updatedResume, token);
    setResume(savedResume);

    // Rebuild experience editor states from saved summaries
    const newExperienceEditorStates = savedResume.experience.map(exp => {
      if (!exp.summary) return EditorState.createEmpty();
      try {
        const blocks = convertFromHTML(exp.summary);
        const contentState = ContentState.createFromBlockArray(
          blocks.contentBlocks,
          blocks.entityMap
        );
        return EditorState.createWithContent(contentState);
      } catch (err) {
        return EditorState.createEmpty();
      }
    });
    setEditorStates(newExperienceEditorStates);

    // Rebuild project editor states from saved descriptions (THIS WAS MISSING)
    const newProjectEditorStates = savedResume.projects.map(proj => {
      if (!proj.description) return EditorState.createEmpty();
      try {
        const blocks = convertFromHTML(proj.description);
        const contentState = ContentState.createFromBlockArray(
          blocks.contentBlocks,
          blocks.entityMap
        );
        return EditorState.createWithContent(contentState);
      } catch (err) {
        return EditorState.createEmpty();
      }
    });
    setProjectEditorStates(newProjectEditorStates);

 toast("Saved successfully!");
    // alert("Saved successfully!");
  } catch (error) {
    console.error("Save failed:", error.message);
     toast("Save failed: " + error.message);
    // alert("Save failed: " + error.message);
  } finally {
    setSaving(false);
  }
};


const handleProjectEditorChange = (index, state) => {
  const rawContent = convertToRaw(state.getCurrentContent());
  const htmlContent = draftToHtml(rawContent); // convert to HTML

  const updatedProjects = [...resume.projects];
  updatedProjects[index].description = htmlContent;

  setResume(prev => ({
    ...prev,
    projects: updatedProjects,
  }));

  const updatedStates = [...projectEditorStates];
  updatedStates[index] = state;
  setProjectEditorStates(updatedStates);
};
// const element = document.getElementById('resume-preview')?.cloneNode(true);
// const links = element.querySelectorAll('a');
// links.forEach(link => {
//   link.style.wordBreak = 'break-all';
// });


// const techs = element.querySelectorAll('.tech-tag, .text-sm');
// techs.forEach(el => {
//   el.textContent = el.textContent.replace(/[<>]/g, '');
// });

// const handleDownloadPDF = () => {
//     const element = resumeRef.current;

//     if (!element) {
//       alert("Resume element not found");
//       return;
//     }

//     // Clone for isolated styling
//     const clone = element.cloneNode(true);
//     clone.style.position = 'fixed';
//     clone.style.top = '-9999px';
//     clone.style.left = '0';
//     document.body.appendChild(clone);

//     const opt = {
//       margin: 0,
//       filename: `${resume.title || 'resume'}.pdf`,
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//       },
//       jsPDF: {
//         unit: 'mm',
//         format: 'a4',
//         orientation: 'portrait',
//       },
//     };

//     html2pdf().set(opt).from(clone).save().finally(() => {
//       document.body.removeChild(clone);
//     });
//   };




// filepath: c:\Users\sange\Desktop\ResumeBuilder\Frontend\resume-builder\src\components\singleResuma.jsx
// ...existing code...
const handleDownloadPDF = () => {
  const element = resumeRef.current;

  if (!element) {
   toast("Resume preview not found.");
    
    return;
  }

 const opt = {
  margin: 0,
  filename: `${resume.title || 'resume'}.pdf`,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 2, // higher scale = better rendering
    useCORS: true,
  },
  jsPDF: {
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
  },
};


  html2pdf().set(opt).from(element).save();
};
// ...existing code...


const handleAiSuggestionChange = (section, index, value) => {
  setResume(prev => ({
    ...prev,
    aiSuggestions: {
      ...prev.aiSuggestions,
      [section]: [
        ...(prev.aiSuggestions[section] || []),
        ...Array(index + 1 - (prev.aiSuggestions[section]?.length || 0)).fill(""),
      ].map((v, i) => (i === index ? value : v))
    }
  }));
};


  const getAISuggestion = async (promptText,section, index = null, field = null) => {
  const token = localStorage.getItem('authToken'); // ✅ Make sure this exists
  setCurrentSuggestion(`${section}-${index}-${field}`);
setLoadingSuggestion(true);

  console.log('Token being used:', token);
  console.log("Prompt being sent:", promptText);
  console.log("resume:", resume);
console.log("section:", section);
console.log("resume[section]:", resume[section]);

    if (!token) {
    console.error('No auth token found in localStorage');
    return;
  }

  try {
    const response = await fetch('https://resume-builder-backend-suc5.onrender.com/api/ai/enhance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ✅ Must be in this format
      },
      body: JSON.stringify({ prompt: promptText })
    });

      const data = await response.json();
    console.log("AI Suggestion:", data);

    const suggestion = data.enhancedResume || data.result || '';

    // ✅ Update the correct field in the form
if (
  section && index !== null && field &&
  Array.isArray(resume[section]) &&
  resume[section][index]
) {
  const updated = [...resume[section]];
  updated[index] = { ...updated[index], [field]: suggestion };

  setResume(prev => ({ ...prev, [section]: updated }));

  if (section === 'experience' && field === 'summary') {
    const contentState = ContentState.createFromText(suggestion);
    const newEditorState = EditorState.createWithContent(contentState);
    setEditorStates(prev => {
      const updatedStates = [...prev];
      updatedStates[index] = newEditorState;
      return updatedStates;
    });
  }
}
if (section === 'projects' && field === 'description') {
  const contentState = ContentState.createFromText(suggestion);
  const newEditorState = EditorState.createWithContent(contentState);
  setProjectEditorStates(prev => {
    const updated = [...prev];
    updated[index] = newEditorState;
    return updated;
  });
}


else if (section === 'summary'&& !index && !field) {
  setResume(prev => ({ ...prev, summary: suggestion }));
    return;
}

  } catch (error) {
    console.error('Error fetching AI suggestion:', error.message);
  }
    finally {
    setLoadingSuggestion(false);
    setLoadingSuggestion(false);
setCurrentSuggestion(null);
  }
};
const addExperience = () => {
  setResume(prev => ({
    ...prev,
    experience: [...prev.experience, {
      company: '', role: '', from: '', to: '', currentlyWorking: false, summary: ''
    }]
  }));

  setEditorStates(prev => [...prev, EditorState.createEmpty()]);
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setResume({ ...resume, [name]: value });
  };

  const handleArrayChange = (e, index, field, section) => {
    const updated = [...resume[section]];
    updated[index][field] = e.target.value;
    setResume({ ...resume, [section]: updated });
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...resume.experience];
    updated[index][field] = value;
    setResume({ ...resume, experience: updated });
  };


  const toggleCurrent = (index) => {
    const updated = [...resume.experience];
    updated[index].currentlyWorking = !updated[index].currentlyWorking;
    setResume({ ...resume, experience: updated });
  };

  const addEntry = (section, template) => {
  setResume(prev => {
    const newSection = [...prev[section], template];
    const newAiSuggestions = { ...prev.aiSuggestions };

    // ✅ If it's a section that needs AI suggestions (like 'projects' or 'experience')
    if (section === 'projects' || section === 'experience') {
      newAiSuggestions[section] = [
        ...(prev.aiSuggestions[section] || []),
        '' // Add empty string placeholder
      ];
    }

    return {
      ...prev,
      [section]: newSection,
      aiSuggestions: newAiSuggestions
    };
  });
};

  const handleListChange = (e, index, section) => {
    const updated = [...resume[section]];
    updated[index] = e.target.value;
    setResume({ ...resume, [section]: updated });
  };


  const deleteField = (section, index) => {
  if (!window.confirm(`Delete this ${section} entry?`)) return;

  const updated = [...resume[section]];
  updated.splice(index, 1);
  setResume({ ...resume, [section]: updated });

  if (section === 'experience') {
    const updatedEditors = [...editorStates];
    updatedEditors.splice(index, 1);
    setEditorStates(updatedEditors);
  }

  if (section === 'projects') {
    const updatedProjects = [...projectEditorStates];
    updatedProjects.splice(index, 1);
    setProjectEditorStates(updatedProjects);
  }
};



// Suggestion Button — improved with loading logic
const SuggestBtn = ({ prompt, section, index = null, field = null }) => {
  const isCurrent = currentSuggestion === `${section}-${index}-${field}`;

  return (
    <button
      type="button"
      onClick={() => getAISuggestion(prompt, section, index, field)}
      className={`ml-2 px-3 py-1 text-sm rounded border transition ${
        isCurrent && loadingSuggestion
          ? 'bg-gray-300 border-gray-400 text-gray-600'
          : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
      }`}
      disabled={loadingSuggestion && isCurrent}
    >
      {isCurrent && loadingSuggestion ? (
        <span className="flex items-center gap-2">
          <Spinner size="sm" /> Generating...
        </span>
      ) : (
        '✨ AI Enhance'
      )}
    </button>
  );
};


  const formSections = [

    // SECTION 0: Basic Info

    <>
      <input name="title" placeholder="Full Name" value={resume.title} onChange={handleChange} className="input" />
      <input name="profession" placeholder="Profession" value={resume.profession} onChange={handleChange} className="input" />
      <textarea name="summary" placeholder="Summary" value={resume.summary} onChange={handleChange} className="input h-32"  />
     <SuggestBtn prompt="Write a professional summary for a resume." section="summary" />
      <input name="email" placeholder="Email" value={resume.email} onChange={handleChange} className="input" />
      <input name="phone" placeholder="Phone" value={resume.phone} onChange={handleChange} className="input" />
      <input name="linkedin" placeholder="LinkedIn" value={resume.linkedin} onChange={handleChange} className="input" />
      <input name="github" placeholder="GitHub" value={resume.github} onChange={handleChange} className="input" />
      <input name="portfolio" placeholder="Portfolio" value={resume.portfolio} onChange={handleChange} className="input" />
      <input name="location" placeholder="location" value={resume.location} onChange={handleChange} className="input" />
    </>,

    // SECTION 1: Education
    <>
      <label className="font-bold">Education</label>
    {resume.education.map((edu, index) => (
  <div key={index} className="space-y-1 border-b pb-3 mb-3">
    <input placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange(e, index, 'degree', 'education')} className="input" />
    <input placeholder="Institution" value={edu.institution} onChange={(e) => handleArrayChange(e, index, 'institution', 'education')} className="input" />
    <input type="month" value={edu.from || ''} onChange={(e) => handleArrayChange(e, index, 'from', 'education')} className="input" />
    {!edu.currentlyStudying && (
      <input type="month" value={edu.to || ''} onChange={(e) => handleArrayChange(e, index, 'to', 'education')} className="input" />
    )}
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={edu.currentlyStudying || false}
        onChange={() => {
          const updated = [...resume.education];
          updated[index].currentlyStudying = !updated[index].currentlyStudying;
          setResume({ ...resume, education: updated });
        }}
      />
      Currently Studying
    </label>
    <button type="button" onClick={() => addEntry('education', { degree: '', institution: '', from: '', to: '', currentlyStudying: false })}  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition">Add Education</button>
      <button type="button" onClick={() => deleteField('education', resume.education.length - 1)}  className="bg-red-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition">Delete</button>
  </div>
))}


    </>,

    // SECTION 2: Skills
    // <>
    //   <label className="font-bold">Skills</label>
    //   {resume.skills.map((skill, index) => (
    //     <input key={index} placeholder="Skill" value={skill} onChange={(e) => handleListChange(e, index, 'skills')} className="input" />
    //   ))}
    //   <button type="button" onClick={() => addEntry('skills', '')}  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition">Add Skill</button>
    //     <button type="button" onClick={() => deleteField('skills', resume.skills.length - 1)}  className="bg-red-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition">Delete</button>
    // </>,
    <>
  <label className="font-bold">Skills</label>
  {resume.skills.map((skill, index) => (
    <input
      key={index}
      placeholder="Skill"
      value={skill}
      onChange={(e) => handleListChange(e, index, 'skills')}
      className="input"
    />
  ))}
  <button type="button" onClick={() => addEntry('skills', '')} className="bg-blue-600 text-white px-6 py-2 rounded">Add Skill</button>
</>,


    // SECTION 3: Experience

    <>
  <label className="font-bold">Experience</label>
  {resume.experience.map((exp, i) => (
    <div key={i} className="space-y-1 border-b pb-3 mb-3">
      <input
        placeholder="Company"
        value={exp.company}
        onChange={(e) => handleExperienceChange(i, 'company', e.target.value)}
        className="input"
      />
      <input
        placeholder="Role"
        value={exp.role}
        onChange={(e) => handleExperienceChange(i, 'role', e.target.value)}
        className="input"
      />
      <input
        type="month"
        placeholder="From"
        value={exp.from || ''}
        onChange={(e) => handleExperienceChange(i, 'from', e.target.value)}
        className="input"
      />
      {!exp.currentlyWorking && (
        <input
          type="month"
          placeholder="To"
          value={exp.to || ''}
          onChange={(e) => handleExperienceChange(i, 'to', e.target.value)}
          className="input"
        />
      )}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={exp.currentlyWorking}
          onChange={() => toggleCurrent(i)}
        />
        Currently Working
      </label>

  <Editor

    editorState={editorStates[i] || EditorState.createEmpty()}
    onEditorStateChange={(state) => handleEditorChange(i, state)}
    wrapperClassName="border rounded p-2"
    editorClassName="min-h-[150px] bg-white p-2"
    toolbarClassName=""
  />


      <SuggestBtn
        prompt={`Write a resume description for a ${exp.role} at ${exp.company}.`}
        section="experience"
        index={i}
        field="summary"
      />


</div>
  ))}

             <button type="button"
        onClick={addExperience}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition">Add Experience</button>
         <button
           type="button"
           onClick={() => deleteField('experience', resume.experience.length - 1)}
           className="bg-red-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
         >
           Delete
         </button>

</>,

// SECTION 5: Projects

<>
  <label className="font-bold">Projects</label>

    {resume.projects.map((proj, index) => (
     <div className="space-y-1 border-b pb-3 mb-3">

           <input
             placeholder="Project Title*"
             value={proj.title}
             onChange={(e) => handleArrayChange(e, index, 'title', 'projects')}
             className="input"
             required
           />
           <input
             placeholder="Project Link "
             value={proj.link}
             onChange={(e) => handleArrayChange(e, index, 'link', 'projects')}
             className="input"
             required
           />
             <input
           placeholder="Technologies Used (e.g., React, Node.js)"
           value={proj.technology || ''}
           onChange={(e) => handleArrayChange(e, index, 'technology', 'projects')}
           className="input mb-3"
           required
         />


         <div className="mb-3">
           <label className="block text-sm font-medium mb-1">Description*</label>
           <Editor
             editorState={projectEditorStates[index] || EditorState.createEmpty()}
             onEditorStateChange={(state) => handleProjectEditorChange(index, state)}
             wrapperClassName="border rounded p-2"
             editorClassName="min-h-[150px] bg-white p-2"
             toolbarClassName="bg-gray-100"
           />
         </div>


           <SuggestBtn
             prompt="Improve this project description for a resume."
             section="projects"
             index={index}
             field="description"
           />
           <button
             type="button"
             onClick={() => deleteField('projects', index)}
             className="text-red-600 hover:text-red-800 text-sm font-medium"
           >
             Remove Project
           </button>
         </div>

    ))}


  <button
    type="button"
    onClick={() => addEntry('projects', { title: '', link: '', technology: '', description: '' })}
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition mt-2"
  >
    + Add Project
  </button>
</>,

    // SECTION 4: Certifications & Languages
// SECTION 6: Certifications & Languages
<>
  <label className="font-bold">Certifications</label>
  {resume.certifications.map((cert, index) => (
    <input
      key={index}
      placeholder="Certification"
      value={cert}
      onChange={(e) => handleListChange(e, index, 'certifications')}
      className="input"
    />
  ))}
  <button type="button" onClick={() => addEntry('certifications', '')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition">
    Add Certification
  </button>

  <button
    type="button"
    onClick={() => deleteField('certifications', resume.certifications.length - 1)}
    className="bg-red-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
  >
    Delete
  </button>
  <br/>

  <label className="font-bold mt-4">Languages</label>
  {resume.languages.map((lang, index) => (
    <input
      key={index}
      placeholder="Language"
      value={lang}
      onChange={(e) => handleListChange(e, index, 'languages')}
      className="input"
    />
  ))}
  <button
    type="button"
    onClick={() => addEntry('languages', '')}
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
  >
    Add Language
  </button>

  <button
    type="button"
    onClick={() => deleteField('languages', resume.languages.length - 1)}
    className="bg-red-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
  >
    Delete
  </button>
</>


  ];
  // const nextStep = () => setStep(prev => Math.min(prev + 1, formSections.length - 1));
  // const prevStep = () => setStep(prev => Math.max(prev - 1, 0));
  return (

  <div className="flex flex-col md:flex-row gap-6" ref={previewRef} id="resume-preview">

    {/* Left side: Form section and navigation */}
<div className="w-full md:w-1/2 space-y-4">
      {formSections[step]}

      {/* Navigation Buttons */}
     <div className="flex justify-between mt-8">
  <button
    onClick={() => setStep(prev => Math.max(prev - 1, 0))}
    disabled={step === 0}
    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
  >
    Back
  </button>
  <button
    onClick={() => setStep(prev => Math.min(prev + 1, formSections.length - 1))}
    disabled={step === formSections.length - 1}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
  >
    Next
  </button>
</div>


      {/* Final Step Buttons */}
      {step === formSections.length - 1 && (
        <div className="flex gap-4 mt-8">
           <button
  onClick={handleSaveResume}
  disabled={saving}
  className={`bg-green-600 text-white px-4 py-2 rounded ${
    saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
  }`}
>
  {saving ? (
    <span className="flex items-center justify-center">
      <Spinner size="sm" className="mr-2" />
      Saving...
    </span>
  ) : (
    'Save Resume'
  )}
</button>

           <button
  type="button"
  onClick={() => {
    localStorage.removeItem('resumeDraft');
    setResume(initialResumeState); // Reset form
    toast.info('Draft cleared');
  }}
  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
>
  Clear Draft
</button>

        </div>
      )}
    </div>


<div className="w-full md:w-1/2 overflow-x-auto">
  <ResumePreview resume={resume} onAiSuggestionChange={handleAiSuggestionChange} ref={resumeRef} />
  <button
    onClick={handleDownloadPDF}
    className="mt-4 w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded shadow"
  >
    Download PDF
  </button>
</div>


  </div>
);

};

export default ResumeForm;