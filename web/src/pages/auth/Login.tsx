import { useEffect, useState, useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Logo from "assets/images/custom/Distributed_Command.png";
import MDAlert from "components/MDAlert";
import { useMaterialUIController, setLayout } from "context";
import { authContext } from "context/auth";
import { toast } from "react-toastify";

function Login({ mode }: any): JSX.Element {
  const { loading, authUser, error: errMsg, handleLogin, handleLogout } = useContext(authContext);
  const [, dispatch] = useMaterialUIController();
  const { pathname } = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleLogin(email, password);
    }
  };
  useEffect(() => {
    if (mode === "logout") handleLogout();
    setLayout(dispatch, "page");
  }, [pathname, mode, loading]);

  return authUser?.isAuthenticated ? (
    <Navigate to="/home" replace={true} />
  ) : (
    <MDBox display="flex" pt={15} justifyContent="center">
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <img src={Logo} style={{ width: "300px" }} />
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="john@distributed.co"
                onKeyDown={handleKeyDown}
                InputLabelProps={{ shrink: true }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                variant="standard"
                fullWidth
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                placeholder="************"
                onKeyDown={handleKeyDown}
                InputLabelProps={{ shrink: true }}
              />
            </MDBox>
            <MDBox>{errMsg && <MDAlert color="warning">{errMsg}</MDAlert>}</MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                disabled={loading}
                onClick={() => handleLogin(email, password)}
              >
                sign in
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </MDBox>
  );
}

export default Login;
