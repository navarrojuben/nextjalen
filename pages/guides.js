// src/Editor.js
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Required for Quill styling


const guides = () => {
  const [content, setContent] = useState('');

  const handleChange = (value) => {
    setContent(value);
  };

  return (
    <div className="editor-container">
      <h2 className="editor-title">React Quill Editor</h2>
      <ReactQuill
        value={content}
        onChange={handleChange}
        theme="snow"
        placeholder="Write your guide here..."
        modules={{
            toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link'],
                ['code-block'],         // for block-level code
                ['clean'],
              ],
        }}
        formats={[
          'header', 'bold', 'italic', 'underline', 'strike',
          'list', 'bullet', 'link', 'image',
        ]}
      />
      <h3 className="preview-title">Preview</h3>
      <div
        className="editor-preview"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default guides;
