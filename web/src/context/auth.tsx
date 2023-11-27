import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import axios from "utils/axios";

interface IAuthUser {
  _id: string;
  refID:string;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  token: string;
  isAuthenticated: boolean;
  permission: any;
}

interface AuthProps {
  children: ReactNode;
}

interface IAuthContext {
  authUser: IAuthUser;
  error: string;
  loading: boolean;
  handleLogin: (email: string, password: string) => void;
  handleLogout: () => void;
}
export const authContext = createContext<IAuthContext | null>(null);

const initialAuthUser = {
  _id: "",
  refID:"",
  firstName: "",
  lastName: "",
  email: "",
  type: "",
  token: "",
  isAuthenticated: false,
  permission: {},
};
const useProvideAuth = () => {
  const localState: IAuthUser = JSON.parse(localStorage.getItem("auth"));
  const [authUser, setAuthUser] = useState<IAuthUser>(initialAuthUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      setError("Please Input All Fields!");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("/user/signin", { email, password });
      setAuthUser({ ...res.data, isAuthenticated: true });
      localStorage.setItem("auth", JSON.stringify({ ...res.data, isAuthenticated: true }));
      // axios.defaults.headers.common["Authorization"] = res.data.token;
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    setAuthUser(initialAuthUser);

    setError("");
  };
  useEffect(() => {
    const local: IAuthUser = JSON.parse(localStorage.getItem("auth"));

    if (local) {
      setAuthUser(local);
    } else setAuthUser(initialAuthUser);
  }, []);
  return {
    authUser,
    loading,
    error,
    handleLogin,
    handleLogout,
  };
};

export function AuthProvider({ children }: AuthProps) {
  const auth = useProvideAuth();
  return <authContext.Provider value={{ ...auth }}>{children}</authContext.Provider>;
}

// export const useAuth = () => useContext(authContext);
