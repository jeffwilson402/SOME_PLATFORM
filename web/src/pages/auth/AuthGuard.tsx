import { FC, useContext, ReactNode, useState, useEffect } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { authContext } from "context/auth";
import { UserTypes } from "interfaces/enums";
interface IAuthGuardProps {
  type: string[];
  children: ReactNode;
}
function AuthGuard({ type, children }: IAuthGuardProps) {
  const location = useLocation();
  console.log(location.pathname);
  const { authUser } = useContext(authContext);
  const [userType, setUserType] = useState(authUser.type);
  useEffect(() => {
    console.log(type, type.includes(authUser.type), authUser);
    setUserType(authUser.type);
  }, [authUser]);
    if (!authUser.isAuthenticated) return <Navigate to="/login" replace={true} />;
  if (type.includes(userType)) return <>{children}</>;
  else {
    switch (authUser.type) {
      case UserTypes.CORE:
        return <Navigate to="/home" replace={true} />;
      case UserTypes.ENGINEER:
        return <Navigate to="/distributed_app" replace={true} />;
      case UserTypes.CLIENT:
        return <Navigate to="/client" replace={true} />;
      default:
        return <>{children}</>;
    }
  }
}

export default AuthGuard;
