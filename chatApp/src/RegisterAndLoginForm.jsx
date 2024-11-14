import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
const RegisterAndLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogInOrRegister, setIsLogInOrRegister] = useState("register");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogInOrRegister === "register" ? "register" : "login";
    const { data } = await axios.post(url, { username, password });
    setLoggedInUsername(username);
    setId(data.id);
  };
  return (
    <div className="bg-gray-300 h-screen flex items-center">
      <form className="w-64 mx-auto" onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          placeholder="Username"
          className="block  w-full p-2 mb-2 border border-black"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
          className="block  w-full p-2 mb-2 border border-black"
        />
        <button className="bg-blue-500 text-white block rounded-sm w-full p-2 mb-2">
          {isLogInOrRegister === "register" ? "Register" : "Login"}
        </button>
        <div className="text-center mt-2">
          {isLogInOrRegister === "register" && (
            <div>
              Already a member?{" "}
              <button
                className="font-semibold"
                onClick={() => {
                  setIsLogInOrRegister("login");
                }}
              >
                Login Here
              </button>
            </div>
          )}
          {isLogInOrRegister === "login" && (
            <div>
              Do not have an account?{" "}
              <button
                className="font-semibold"
                onClick={() => {
                  setIsLogInOrRegister("register");
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterAndLoginForm;
