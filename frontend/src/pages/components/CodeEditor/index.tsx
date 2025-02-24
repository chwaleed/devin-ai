import { useState } from "react";
import Sidebar from "./components/Sidebar";
import RenderCode from "./components/RenderCode";

function CodeEditor({ fileTree, setFileTree }) {
  const [openedFiles, setOpenedFiles] = useState<string[]>([]);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  return (
    <section className="right  bg-red-50 flex-grow h-full flex">
      <Sidebar
        fileTree={fileTree}
        onClick={(file: string) => {
          setCurrentFile(file);

          setOpenedFiles((prevState) => [...new Set([...prevState, file])]);
        }}
      />

      <RenderCode
        openedFiles={openedFiles}
        setCurrentFile={setCurrentFile}
        currentFile={currentFile}
        fileTree={fileTree}
        setFileTree={setFileTree}
      />
    </section>
  );
}

export default CodeEditor;
