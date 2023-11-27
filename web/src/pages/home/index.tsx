import { useContext } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Card from "./Card";
import links from "./links";
import { authContext } from "context/auth";
import { permissionRoute } from "context/constants";

function Home(): JSX.Element {
  const { authUser } = useContext(authContext);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <Grid container spacing={3}>
          {links.map((link) => {
            const permissionKey = permissionRoute[link.key];
            const isAllowed = authUser?.permission[permissionKey] || permissionKey === "all";
            if (isAllowed)
              return (
                <Grid item xs={12} md={6} lg={3} key={link.title}>
                  <MDBox mb={1.5} mt={1.5}>
                    <Card image={link.image} title={link.title} link={link.link} />
                  </MDBox>
                </Grid>
              );
          })}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Home;
