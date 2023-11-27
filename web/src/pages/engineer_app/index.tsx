import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { setLayout, useMaterialUIController } from "context";
import ResponsiveAppBar from "./AppBar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {
  Card,
  Divider,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import NavCard from "pages/home/Card";
import RoleIcon from "assets/images/svg/engineer/roles.svg";
import { navlinks } from "./navs";
import { Book, PlayCircle } from "@mui/icons-material";
import LinkCrumbs from "./BreadCrumbs";

function EngineerApp(): JSX.Element {
  const [, dispatch] = useMaterialUIController();
  useEffect(() => {
    setLayout(dispatch, "page");
  }, []);
  return (
    <MDBox>
      <ResponsiveAppBar />
      <MDBox>
        <LinkCrumbs />
        <Divider />
        <MDBox display="flex" justifyContent="center" flexDirection="column" mb={2}>
          <MDTypography variant="h4" align="center" textGradient>
            Manage your roles, skills, learning, projects, and goals.
          </MDTypography>
          <MDTypography variant="subtitle2" align="center">
            Make your value known to colleagues, employers, and connections!
          </MDTypography>
        </MDBox>
        <MDBox p={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <MDBox>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableBody>
                      <TableRow>
                        <TableCell style={{ padding: 20 }}>
                          <MDTypography variant="h5">All Learning</MDTypography>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <MDBox display="flex" alignItems="center">
                            <Book color="info" fontSize="medium" />
                            <MDBox ml={1}>
                              <MDTypography variant="subtitle2">Elastic Team Member</MDTypography>
                            </MDBox>
                          </MDBox>
                        </TableCell>
                        <TableCell align="right">
                          <PlayCircle color="info" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <MDBox display="flex" alignItems="center">
                            <Book color="info" fontSize="medium" />
                            <MDBox ml={1}>
                              <MDTypography variant="subtitle2">Front-End Development</MDTypography>
                            </MDBox>
                          </MDBox>
                        </TableCell>
                        <TableCell align="right">
                          <PlayCircle color="info" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </MDBox>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={1}>
                {navlinks.map((nav: any) => (
                  <Grid item xs={12} sm={4}>
                    <NavCard {...nav} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

export default EngineerApp;
