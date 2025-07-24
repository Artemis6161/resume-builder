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
      // Reduced overall padding to p-6 to help prevent extra pages when headings are larger
      className="w-full max-w-[210mm] bg-white p-6 shadow-lg rounded-md text-black text-sm font-sans leading-relaxed"
    >
      <h1 className="font-bold text-3xl text-center">{resume.title}</h1>
      <h2 className="text-center text-lg font-medium">{resume.profession}</h2>
      <p className="text-center  mt-1">
        {resume.email} | {resume.phone} |{" "}
        <a href={resume.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        {resume.github && <> | <a href={resume.github} target="_blank" rel="noopener noreferrer">GitHub</a></>}
        {resume.portfolio && <> | <a href={resume.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a></>} | {resume.location}
             
      </p>

      {resume.summary && (
        <section>
          {/* Increased heading size to text-lg and reduced margin-top to mt-2 for compaction */}
          <h2 className="font-bold mt-2 text-lg">Professional Summary</h2>
          <p className="whitespace-pre-line">{resume.summary || 'NO SUMMARY'}</p>
        </section>
      )}

      {resume.education?.length > 0 && (
        <section>
          {/* Increased heading size to text-lg and reduced margin-top to mt-2 for compaction */}
          <h2 className="font-bold mt-2 text-lg">Education</h2>
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
          {/* Increased heading size to text-lg and reduced margin-top to mt-2 for compaction */}
          <h2 className="font-bold mt-2 text-lg">Experience</h2>
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
                  <h3 className="font-semibold text-sm mb-1">AI Suggestions:</h3>
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
          {/* Increased heading size to text-lg and reduced margin-top to mt-2 for compaction */}
          <h2 className="font-bold mt-2 text-lg">Skills</h2>
          <p >{resume.skills.join(', ')}</p>
        </section>
      )}

      {validProjects.length > 0 && (
        <section>
          {/* Increased heading size to text-lg and reduced margin-top to mt-2 for compaction */}
          <h2 className="font-bold mt-2 text-lg">Projects</h2>
          {validProjects.map((project, i) => {
            return (
              <div key={i} className="my-5">
                <div className="flex justify-between items-start gap-4 flex-wrap md:flex-nowrap">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold">{project.title}</h2>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p>
                      <a href={project.link} target="_blank" rel="noopener noreferrer">demo link</a>
                    </p>
                    <p>
                      <span className="font-semibold">Tech:</span> {project.technology}
                    </p>
                  </div>
                </div>
                {/* Description always on next line */}
                {project.description && (
                  <div className="text-sm mt-2 block w-full">
                    <div
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.description || '') }}
                    />
                  </div>
                )}
                {/* AI Suggestions section for each project */}
                {resume.aiSuggestions?.project?.[i] && (
                  // Adjusted mt-4 to mt-6 for more space above AI suggestions within projects
                  <div className="mt-6 text-left">
                    {/* Increased heading size for AI Suggestions to text-sm */}
                    <h3 className="font-semibold text-sm mb-1">AI Suggestions:</h3>
                    <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={resume.aiSuggestions.project[i]}
                        onChange={(value) => handleAiSuggestionEdit("project", i, value)}
                        modules={modules}
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {resume.certifications?.length > 0 && (
        <section>
          {/* Increased heading size to text-lg and reduced margin-top to mt-2 for compaction */}
          <h2 className="font-bold mt-2 text-lg">Certifications</h2>
          <ul className="list-disc pl-5">
            {resume.certifications.map((cert, i) => (
              <li key={i}>{cert}</li>
            ))}
          </ul>
        </section>
      )}

      {resume.languages?.length > 0 && (
        <section>
          {/* Increased heading size to text-lg and reduced margin-top to mt-2 for compaction */}
          <h2 className="font-bold mt-2 text-lg">Languages</h2>
          <p>{resume.languages.join(', ')}</p>
        </section>
      )}
    </div>
  );
});

export default ResumePreview;