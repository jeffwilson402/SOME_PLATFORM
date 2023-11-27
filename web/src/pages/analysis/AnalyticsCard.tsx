/* eslint-disable no-unused-vars */

import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Declaring prop types for the ComplexProjectCard
interface Props {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "light";
  image: string;
  title: string;
  name: string;
  description: string;
  url: string;
  [key: string]: any;
}

// Custom styles for ComplexProjectCard
function AnalyticsCard({ color, image, title, name, description, url }: Props): JSX.Element {
  const navigate = useNavigate();
  return (
    <Card style={{ padding: 20, cursor: "pointer" }} onClick={() => navigate(`/analysis/${url}`)}>
      <MDBox>
        <MDTypography variant="subtitle2">{title}</MDTypography>
      </MDBox>
      <MDBox my={1} display="flex" alignItems="center" justifyContent="space-between">
        <MDBox lineHeight={0}>
          <MDTypography variant="h4" textTransform="capitalize" fontWeight="medium">
            {name}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" alignItems="center">
          <MDAvatar
            src={image}
            alt={name}
            size="xl"
            variant="rounded"
            sx={{ borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl }}
          />
        </MDBox>
      </MDBox>
      <MDBox lineHeight={1}>
        <MDBox>
          <MDBadge
            variant="gradient"
            size="lg"
            color={color}
            badgeContent={
              <>
                <Icon>trending_up</Icon>&nbsp;{description}
              </>
            }
          />
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Declaring default props for ComplexProjectCard
AnalyticsCard.defaultProps = {
  color: "dark",
  dropdown: false,
};

export default AnalyticsCard;
