import { useContext } from "react";
import RegisterAndLoginForm from "./RegisterAndLoginForm";
import { UserContext } from "./UserContext";

const Routes = () => {
  const { username, id } = useContext(UserContext);
  return <RegisterAndLoginForm />;
};

export default Routes;
