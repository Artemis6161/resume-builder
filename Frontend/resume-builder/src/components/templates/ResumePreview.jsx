 import React, { forwardRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

// ✅ Toolbar config with alignment options
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link'],
    ['clean'],
  ],
};

const ResumePreview = forwardRef(({ resume, onAiSuggestionChange, isExporting = false }, resumeRef) => {

  if (!resume) return null;

  const validExperiences = Array.isArray(resume.experience)
    ? resume.experience.filter(
        (exp) =>
          exp &&
          (exp.role?.trim() ||
            exp.company?.trim() ||
            exp.summary?.trim() ||
            exp.from ||
            exp.to)
      )
    : [];

  const validProjects = Array.isArray(resume.projects)
    ? resume.projects.filter(
        (proj) =>
          proj &&
          (proj.title?.trim() ||
            proj.description?.trim() ||
            proj.technology?.trim() ||
            proj.link?.trim())
      )
    : [];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const handleAiSuggestionEdit = (section, index, value) => {
    if (onAiSuggestionChange) {
      onAiSuggestionChange(section, index, value);
    }
  };

  return (
    <div
      ref={resumeRef}
      id="resume-preview"
     className="w-full max-w-[210mm] min-h-[297mm] bg-white p-6 shadow-lg rounded-md mx-auto text-black text-sm font-sans leading-relaxed"
    >
      <h1 className="font-bold text-xl text-center">{resume.title}</h1>
      <h2 className="text-center text-sm font-medium">{resume.profession}</h2>
      <p className="text-center text-xs mt-1">
        {resume.email} | {resume.phone} |{" "}
        <a href={resume.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        {resume.github && <> | <a href={resume.github} target="_blank" rel="noopener noreferrer">GitHub</a></>}
        {resume.portfolio && <> | <a href={resume.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a></>}
      </p>

      {resume.summary && (
        <section>
          <h2 className="font-bold mt-4">Professional Summary</h2>
          <p className="whitespace-pre-line">{resume.summary || 'NO SUMMARY'}</p>
        </section>
      )}

      {resume.education?.length > 0 && (
        <section>
          <h2 className="font-bold mt-4">Education</h2>
          {resume.education.map((edu, i) => (
            <div key={i} className="my-5">
              <h2 className="text-sm font-bold flex justify-between">{edu.institution}</h2>
              <h2 className="text-xs flex justify-between">
                {edu.degree}
                <span>{formatDate(edu.from)} – {edu.currentlyStudying ? 'Present' : formatDate(edu.to)}</span>
              </h2>
            </div>
          ))}
        </section>
      )}

      {validExperiences.length > 0 && (
        <section>
          <h2 className="font-bold mt-4">Experience</h2>
          {validExperiences.map((exp, i) => (
            <div key={i} className="my-5">
              <h2 className="text-sm font-bold flex justify-between">{exp.role}</h2>
              <div className="text-xs flex justify-between">
                <span>{exp.company}</span>
                <span>{formatDate(exp.from)} – {exp.currentlyWorking ? "Present" : formatDate(exp.to)}</span>
              </div>
              {exp.summary && (
                <div
                  className="text-sm mt-1 [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(exp.summary || '') }}
                />
              )}

              {resume.aiSuggestions?.experience?.[i] && (
                <div className="mt-4 text-left">
                  <h3 className="font-semibold text-xs mb-1">AI Suggestions:</h3>
                  <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={resume.aiSuggestions.experience[i]}
                      onChange={(value) => handleAiSuggestionEdit("experience", i, value)}
                      modules={modules}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {resume.skills?.length > 0 && (
        <section>
          <h2 className="font-bold mt-4">Skills</h2>
          <h2 className="text-xs">{resume.skills.join(', ')}</h2>
        </section>
      )}


{validProjects.length > 0 && (
  <section>
    <h2 className="font-bold mt-4">Projects</h2>
    {validProjects.map((project, i) => {
      // Sanitize technology and link
      const safeTech = String(project.technology || '').replace(/[<>]/g, '');
      const safeLink = String(project.link || '').replace(/[<>]/g, '');
      // Simple URL validation
      const isValidUrl = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(safeLink);

      return (
        <div key={i} className="my-5">
          <div className="flex justify-between items-start gap-4 flex-wrap md:flex-nowrap">
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold">{project.title}</h2>
              {project.description && (
                <div
                  className="text-sm mt-1 [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.description || '') }}
                />
              )}
            </div>
<div className="mt-1 flex flex-wrap justify-start text-sm gap-x-6 gap-y-1 overflow-x-auto max-w-full">
  
  {safeTech && (
    <p className="break-all">
      <span className="font-semibold">Tech:</span> {safeTech}
    </p>
  )}
{safeLink && (
  <p className="text-blue-600 underline break-words max-w-full">
    <a href={safeLink} target="_blank" rel="noopener noreferrer" className="break-words">
      {safeLink}
    </a>
  </p>
)}

  {isValidUrl && (
    <p className="text-blue-600 underline break-all">
      <a href={safeLink} target="_blank" rel="noopener noreferrer" className="break-all">
        {safeLink}
      </a>
    </p>
  )}
</div>
          </div>
          {/* ...AI Suggestions... */}
        </div>
      );
    })}
  </section>
)}



      {resume.certifications?.length > 0 && (
        <section>
          <h2 className="font-bold mt-4">Certifications</h2>
          <ul className="list-disc pl-5">
            {resume.certifications.map((cert, i) => (
              <li key={i}>{cert}</li>
            ))}
          </ul>
        </section>
      )}

      {resume.languages?.length > 0 && (
        <section>
          <h2 className="font-bold mt-4">Languages</h2>
          <p>{resume.languages.join(', ')}</p>
        </section>
      )}
    </div>
  );
});

export default ResumePreview;