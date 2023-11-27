import { useContext } from "react";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { authContext } from "context/auth";

function Learning(): JSX.Element {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}></MDBox>
    </DashboardLayout>
  );
}

export default Learning;
