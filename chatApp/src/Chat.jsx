import { useContext, useEffect, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { username, id } = useContext(UserContext);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);
  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  };
  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    }
  };
  const onlinePeopleExcludingOurUser = { ...onlinePeople };
  delete onlinePeopleExcludingOurUser[id];
  return (
    <div className="flex h-screen">
      <div className="bg-gray-100 w-1/3 pl-3 pt-3 ">
        <Logo />

        {Object.keys(onlinePeopleExcludingOurUser).map((userId) => (
          <div
            onClick={() => setSelectedUserId(userId)}
            className={
              "border-b  flex gap-2 items-center cursor-pointer " +
              (userId === selectedUserId ? "bg-blue-100" : "")
            }
            key={userId}
          >
            {userId === selectedUserId && (
              <div className="w-1 h-12 rounded-r-md bg-blue-500"></div>
            )}
            <div className="items-center py-2 pl-4 flex gap-2">
              <Avatar username={onlinePeople[userId]} userId={userId} />
              <span className="font-semibold"> {onlinePeople[userId]}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-blue-200 w-2/3 p-2 flex flex-col">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="text-gray-500 font-bold text-2xl">
                <span className="text-2xl">&larr;</span> Select a person from
                the sidebar
              </div>
            </div>
          )}
        </div>
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
