import { FC, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "context/auth";
function Logout(): JSX.Element {
  const { handleLogout } = useContext(authContext);
  useEffect(() => {
    handleLogout();
  },[]);
  return <Navigate to="/login" />;
}

export default Logout;
