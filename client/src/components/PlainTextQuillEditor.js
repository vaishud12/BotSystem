import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PlainTextQuillEditor = ({ onChange, value }) => {
  const handleRemarkChange = (content) => {
    // Remove HTML tags using regex, leaving only plain text
    const plainText = content.replace(/<\/?[^>]+(>|$)/g, "");
    onChange(plainText);
  };

  return (
    <ReactQuill
      value={value}
      onChange={handleRemarkChange}
      theme="snow"
      placeholder="Add a remark..."
      modules={{
        toolbar: [
          [{ header: '1' }, { header: '2' }, { font: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['bold', 'italic', 'underline'],
          ['link', 'image'],
          [{ align: [] }],
          ['clean']
        ],
      }}
    />
  );
};

export default PlainTextQuillEditor;
