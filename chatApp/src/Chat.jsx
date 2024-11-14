import { useEffect, useState } from "react";

const Chat = () => {
  const [ws, setWs] = useState(null);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);
  const handleMessage = (e) => {
    console.log(e.data);
  };
  return (
    <div className="flex h-screen">
      <div className="bg-gray-100 w-1/3 ">Contacts</div>
      <div className="bg-blue-200 w-2/3 p-2 flex flex-col">
        <div className="flex-grow">Current Chat</div>
        <div className="flex gap-2 mx-2">
          <input
            type="text"
            placeholder="Type here"
            className="bg-white p-2 flex-grow border rounded-md shadow-md"
          />
          <button className="bg-blue-400 p-2 text-white rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
