import React, { useRef, useState } from "react";
import { ref, set } from "firebase/database";
import { database } from "../utils/firebaseConfig";
import { Editor } from "@monaco-editor/react";
import { Play, Copy, Lock, Minimize2, GripHorizontal, Trash2 } from 'lucide-react';
import styles from './CodeEditor.module.css';
import axios from "axios";
import withWindowLogic from "./withWindowLogic";

const SUPPORTED_LANGUAGES = [
  'python',
  'java',
  'cpp',
  'csharp',
  'c'
];

const CodeEditor = ({
  value, currentUserName, roomId, toggleMinimize, isCreator, handleCopy, handleTitleChange, toggleLock, handleDelete
}) => {
  const [language, setLanguage] = useState('python');
  const [isDark, setIsDark] = useState(true);
  const [output, setOutput] = useState('');
  const editorRef = useRef(null);
  const languageSettings = {
    python: { fileName: 'main.py', version: '3.10.0' },
    java: { fileName: 'Main.java', version: '15.0.2' },
    csharp: { fileName: 'Program.cs', version: '9.0' },
    cpp: { fileName: 'main.cpp', version: '10.2.0' },
    c: { fileName: 'main.c', version: '10.2.0' },
  };



  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = () => {

    const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
    set(windowRef, { id: value.id, content: editorRef.current.getValue(), creater: value.creater, locked: value.locked, typeOfNode: value.typeOfNode, title: value.title });
  }

  const executeCode = async () => {
    const code = editorRef.current.getValue();
    const { fileName, version } = languageSettings[language];
    const program = {
      language: language,
      version: version,
      files: [
        {
          name: fileName,
          content: code,
        },
      ],
    };

    try {
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', program, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setOutput(response.data.run.output);
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput('Error executing code');
    }
  };



  return (

    <div className={styles.editor}>
      <div className={styles.titleBar}>
        <GripHorizontal className={`${styles.dragHandle} drag-handle`} size={16} />
        <div className={styles.title} contentEditable suppressContentEditableWarning onBlur={handleTitleChange} ><span>{value?.title}</span></div>

        <div className={styles.controls}>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`${styles.control} ${isDark ? styles.active : ''}`}
            title="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => toggleLock()}
            className={`${styles.control} ${value.locked ? styles.active : ''}`}
            title="Lock editor"
          >
            <Lock size={16} />
          </button>
          <button
            onClick={handleCopy}
            className={styles.control}
            title="Copy code"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={handleDelete}
            className={styles.control}
            title="Clear"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={toggleMinimize}
            className={styles.control}
            title="Minimize"
          >
            <Minimize2 size={16} />
          </button>
        </div>
      </div>


      <>
        <div className={styles.toolbar}>
          <select
            className={styles.languageSelect}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={executeCode}
            className={styles.runButton}
          >
            <Play size={14} /> Run
          </button>
        </div>

        <div className={styles.editorContainer}>
          <Editor
            language={language}
            value={value?.content?.content}
            theme={isDark ? 'vs-dark' : 'light'}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              readOnly: !isCreator && value.locked,
              automaticLayout: true,
            }}
          />
        </div>


        {output && (
          <div className={styles.output}>
            <pre>{output}</pre>
          </div>
        )}

      </>

    </div>

  );
};

export const Code = withWindowLogic(CodeEditor);