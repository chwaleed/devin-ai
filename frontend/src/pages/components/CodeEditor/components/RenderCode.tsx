import hljs from "highlight.js";

function RenderCode({
  setCurrentFile,
  openedFiles,
  currentFile,
  fileTree,
  setFileTree,
}) {
  //   console.log(fileTree[currentFile].file.contents);
  return (
    <div className="code-editor flex flex-col flex-grow h-full shrink">
      <div className="top flex justify-between w-full">
        <div className="files flex">
          {openedFiles.map((file, index) => (
            <button
              key={index}
              onClick={() => setCurrentFile(file)}
              className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${
                currentFile === file ? "bg-slate-400" : ""
              }`}
            >
              <p className="font-semibold text-lg">{file}</p>
            </button>
          ))}
        </div>

        {/* <div className="actions flex gap-2">
          <button
            onClick={async () => {
              await webContainer.mount(fileTree);

              const installProcess = await webContainer.spawn("npm", [
                "install",
              ]);

              installProcess.output.pipeTo(
                new WritableStream({
                  write(chunk) {
                    console.log(chunk);
                  },
                })
              );

              if (runProcess) {
                runProcess.kill();
              }

              let tempRunProcess = await webContainer.spawn("npm", ["start"]);

              tempRunProcess.output.pipeTo(
                new WritableStream({
                  write(chunk) {
                    console.log(chunk);
                  },
                })
              );

              setRunProcess(tempRunProcess);

              webContainer.on("server-ready", (port, url) => {
                console.log(port, url);
                setIframeUrl(url);
              });
            }}
            className="p-2 px-4 bg-slate-300 text-white"
          >
            run
          </button>
        </div> */}
      </div>
      <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
        {fileTree[currentFile] && (
          <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
            <pre className="hljs h-full">
              <code
                className="hljs h-full outline-none"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const updatedContent = e.target.innerText;
                  const ft = {
                    ...fileTree,
                    [currentFile]: {
                      file: {
                        contents: updatedContent,
                      },
                    },
                  };
                  setFileTree(ft);
                  //   saveFileTree(ft);
                }}
                dangerouslySetInnerHTML={{
                  __html: hljs.highlight(
                    "javascript",
                    fileTree[currentFile].file.contents
                  ).value,
                }}
                style={{
                  whiteSpace: "pre-wrap",
                  paddingBottom: "25rem",
                  counterSet: "line-numbering",
                }}
              />
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default RenderCode;
