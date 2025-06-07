// components/CodePreview.js
'use client';

import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-markup';

const CodePreview = ({ snippet }) => {
  useEffect(() => {
    const codeElement = document.querySelector(`#code-block-${snippet._id} code`);
    if (codeElement) {
      Prism.highlightElement(codeElement);
    }
  }, [snippet._id]);

  return (
    <pre id={`code-block-${snippet._id}`} className="codes-code-snippet-code-block">
      <code className={`language-${snippet.language || 'javascript'}`}>
        {snippet.code}
      </code>
    </pre>
  );
};

export default CodePreview;
