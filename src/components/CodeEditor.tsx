import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  onRun: (code: string) => void;
  error: string | null;
  defaultCode: string;
}

export default function CodeEditor({
  onRun,
  error,
  defaultCode,
}: CodeEditorProps) {
  const [code, setCode] = useState(defaultCode);

  useEffect(() => {
    setCode(defaultCode);
  }, [defaultCode]);

  const handleRun = () => {
    onRun(code);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Code Editor</h2>
      <Editor
        height="300px"
        defaultLanguage="javascript"
        value={code}
        onChange={(value) => setCode(value || "")}
      />
      <button
        onClick={handleRun}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Run Code
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
