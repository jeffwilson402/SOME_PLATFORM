/* eslint-disable no-unused-vars */

import { ReactNode } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

import ProjectPlaceholder from "assets/images/custom/project_placeholder.png";

// Declaring prop types for the ComplexProjectCard
interface Props {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "light";
  image: string;
  name: string;
  dropdown?: {
    action?: (...arg: any) => void;
    menu?: ReactNode;
  };
  code: string;
  [key: string]: any;
}

// Custom styles for ComplexProjectCard
function ProjectCard({ color, image, name, code, dropdown }: Props): JSX.Element {
  return (
    <Card>
      <MDBox p={2}>
        {dropdown && (
          <MDTypography
            color="secondary"
            onClick={dropdown.action}
            sx={{
              ml: "auto",
              mt: -1,
              alignSelf: "flex-start",
              py: 1.25,
            }}
          >
            <Icon sx={{ cursor: "pointer", fontWeight: "bold" }}>more_vert</Icon>
          </MDTypography>
        )}
        {dropdown.menu}
        {/* </MDBox> */}
        <MDBox display="flex" alignItems="center" justifyContent="space-around" mb={3}>
          <MDAvatar
            src={image || ProjectPlaceholder}
            alt={name}
            size="xl"
            variant="rounded"
            bgColor={color}
            sx={{ borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl }}
          />
        </MDBox>

        <MDBox lineHeight={2}>
          <MDTypography align="center" variant="h5" textTransform="capitalize" fontWeight="medium">
            {name}
          </MDTypography>
        </MDBox>
        <MDBox my={2} lineHeight={1} display="flex" alignItems="center" justifyContent="center">
          <Icon>qr_code</Icon>
          <MDTypography variant="subtitle2" ml={1}>
            {code}
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Declaring default props for ComplexProjectCard
ProjectCard.defaultProps = {
  color: "dark",
  dropdown: false,
};

export default ProjectCard;
