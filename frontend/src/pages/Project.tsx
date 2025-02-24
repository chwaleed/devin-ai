import { useContext, useEffect, useRef, useState } from "react";
import Model from "./components/Model";
import Loader from "./components/Loader";
import { useLocation } from "react-router-dom";
import { context } from "../context/context";
import { initializeSocket, receiveMessage, sendMessage } from "../auth/socket";
import { getAllUsers } from "./components/method";
import RenderMessage from "./components/RenderMessage";
import CodeEditor from "./components/CodeEditor";

function Project() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<Array<user | null>>([]);
  const [addedCollabs, setAddedCollabs] = useState<Array<string | null>>([]);
  const [message, setMessage] = useState("");
  const { methods, state } = useContext(context);
  const location = useLocation();
  const { project } = location.state;
  const messageBox = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Array<message>>([]);
  const [fileTree, setFileTree] = useState({});

  type message = {
    sender?: string;
    message: string;
  };

  type user = {
    email: string;
    _id: string;
  };

  useEffect(() => {
    initializeSocket(project._id);

    receiveMessage("project-message", (data: message) => {
      console.log(message);
      setMessages((prev) => [
        ...prev,
        { message: data.message, sender: data?.sender },
      ]);
      if (data?.sender === "AI") {
        hanldeCodeFiles(data?.message);
      }
    });

    if (methods && methods.getProject) {
      methods.getProject({ projectId: project?._id });
    }
  }, []);

  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
  }, [messages]);

  const handleUserClick = (userId: string) => {
    if (addedCollabs.includes(userId)) {
      setAddedCollabs(addedCollabs.filter((collab) => collab !== userId));
    } else {
      setAddedCollabs([...addedCollabs, userId]);
    }
  };

  const getCallaborators = () => {
    setIsModalOpen(true);
    getAllUsers({ setUsers });
  };

  const close = () => {
    setIsModalOpen(false);
  };

  const onClick = () => {
    if (addedCollabs.length === 0) return;
    methods.addUsers({
      users: addedCollabs.filter((userId): userId is string => userId !== null),
    });
    close();
    setAddedCollabs([]);
  };

  const send = () => {
    if (message === "") return;
    sendMessage("project-message", message);
    setMessages((prev) => [
      ...prev,
      { sender: state.user?.email, message: message },
    ]);
    setMessage("");
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      send();
      return;
    }
    return;
  };

  const hanldeCodeFiles = (data: string) => {
    let files;
    try {
      files = JSON.parse(data);
      const filetree = files?.fileTree;
      setFileTree(filetree);
    } catch (error) {
      files = null;
      console.log("Error in converting to json ", error);
    }
  };

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">
        <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0">
          <button className="flex gap-2" onClick={getCallaborators}>
            <i className="ri-add-fill mr-1"></i>
            <p>Add collaborator</p>
          </button>
          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="p-2"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>
        <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
          <div
            ref={messageBox}
            className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide"
          >
            {messages.map((msg, index) => {
              return (
                <RenderMessage msg={msg} key={index} user={state.user?.email} />
              );
            })}
          </div>

          <div className="inputField w-full flex absolute bottom-0">
            <input
              value={message}
              onKeyDown={handleEnter}
              onChange={(e) => setMessage(e.target.value)}
              className="p-2 px-4 border-none outline-none flex-grow"
              type="text"
              placeholder="Enter message"
            />
            <button onClick={send} className="px-5 bg-slate-950 text-white">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>
        <div
          className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0`}
        >
          <header className="flex justify-between items-center px-4 p-2 bg-slate-200">
            <h1 className="font-semibold text-lg">Collaborators</h1>

            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2"
            >
              <i className="ri-close-fill"></i>
            </button>
          </header>
          <div className="users flex flex-col gap-2">
            {state?.activeProject &&
              state?.activeProject?.users?.map((user) => {
                return (
                  <div className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center">
                    <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                      <i className="ri-user-fill absolute"></i>
                    </div>
                    <h1 className="font-semibold text-lg">{user.email}</h1>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {fileTree && <CodeEditor fileTree={fileTree} setFileTree={setFileTree} />}

      {/* <section className="right  bg-red-50 flex-grow h-full flex">
        <div className="explorer h-full max-w-64 min-w-52 bg-slate-200">
          <div className="file-tree w-full">
            {Object.keys(fileTree).map((file, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentFile(file);
                  setOpenFiles([...new Set([...openFiles, file])]);
                }}
                className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full"
              >
                <p className="font-semibold text-lg">{file}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="code-editor flex flex-col flex-grow h-full shrink">
          <div className="top flex justify-between w-full">
            <div className="files flex">
              {openFiles.map((file, index) => (
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

            <div className="actions flex gap-2">
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

                  let tempRunProcess = await webContainer.spawn("npm", [
                    "start",
                  ]);

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
            </div>
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
                      saveFileTree(ft);
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

        {iframeUrl && webContainer && (
          <div className="flex min-w-96 flex-col h-full">
            <div className="address-bar">
              <input
                type="text"
                onChange={(e) => setIframeUrl(e.target.value)}
                value={iframeUrl}
                className="w-full p-2 px-4 bg-slate-200"
              />
            </div>
            <iframe src={iframeUrl} className="w-full h-full"></iframe>
          </div>
        )}
      </section> */}

      {isModalOpen && (
        <Model close={close} onClick={onClick}>
          <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
            {users.length > 0 ? (
              users?.map((user) => (
                <div
                  key={user?._id}
                  className={`user cursor-pointer hover:bg-slate-200 ${
                    addedCollabs.some((collab) => collab === user?._id)
                      ? "bg-slate-200"
                      : ""
                  } p-2 flex gap-2 items-center`}
                  onClick={() => handleUserClick(user?._id || "")}
                >
                  <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-semibold text-lg">{user?.email}</h1>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center">
                <Loader />
              </div>
            )}
          </div>
        </Model>
      )}
    </main>
  );
}

export default Project;

{
  /* {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender._id === "ai" ? "max-w-80" : "max-w-52"
                } ${
                  msg.sender._id == user._id.toString() && "ml-auto"
                }  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}
              >
                <small className="opacity-65 text-xs">{msg.sender.email}</small>
                <div className="text-sm">
                  {msg.sender._id === "ai" ? (
                    WriteAiMessage(msg.message)
                  ) : (
                    <p>{msg.message}</p>
                  )}
                </div>
              </div>
              
            ))} */
}
