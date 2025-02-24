import PreviewMKD from "./PreviewMKD";

type message = {
  sender?: string;
  message: string;
};

function RenderMessage({
  msg,
  user,
}: {
  msg: message;
  user: string | undefined;
}) {
  let message = msg.message;
  if (msg.sender === "AI") {
    try {
      const data = JSON.parse(msg.message);
      message = data.text;
    } catch (error) {
      console.error("Error parsing JSON message: ", error);
    }
  }
  return (
    <div
      className={`${msg.sender === "AI" ? "max-w-[360px]" : "max-w-52"} ${
        msg.sender == user && "ml-auto"
      }  message flex flex-col p-2 bg-white w-fit rounded-md`}
    >
      <small className="opacity-65 text-xs">{msg.sender}</small>
      <div className="text-sm">
        <PreviewMKD content={message} />
      </div>
    </div>
  );
}

export default RenderMessage;
