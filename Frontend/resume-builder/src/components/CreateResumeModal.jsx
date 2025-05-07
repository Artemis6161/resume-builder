// components/CreateResumeModal.js
import React, { useState } from 'react';

const CreateResumeModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (title.trim()) {
      onCreate(title);
      setTitle('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Enter Resume Title</h2>
        <input
          type="text"
          placeholder="e.g., Frontend Resume"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
        </div>
      </div>
    </div>
  );
};

export default CreateResumeModal;
