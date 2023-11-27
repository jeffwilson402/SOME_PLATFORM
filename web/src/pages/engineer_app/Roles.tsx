import MDBox from "components/MDBox";
import { Breadcrumbs, Link } from "@mui/material";
import MDTypography from "components/MDTypography";

function LinkCrumbs(): JSX.Element {
  return (
    <MDBox p={3}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/" variant="subtitle2">
          Home
        </Link>
        <MDTypography variant="subtitle2" color="default">
          Dashboard
        </MDTypography>
      </Breadcrumbs>
    </MDBox>
  );
}

export default LinkCrumbs;
