/* eslint-disable no-unused-vars */

import { ReactNode } from "react";

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
  name: string;
  description: ReactNode;
  location?: string;
  approval_status?: boolean;
  dropdown?: {
    action?: (...arg: any) => void;
    menu?: ReactNode;
  };
  [key: string]: any;
}

// Custom styles for ComplexProjectCard
function PersonCard({
  color,
  image,
  name,
  description,
  dropdown,
  location,
  approval_status,
}: Props): JSX.Element {
  return (
    <Card>
      <MDBox p={2}>
        <MDBox display="flex" alignItems="center">
          <MDAvatar
            src={image}
            alt={name}
            size="xl"
            variant="rounded"
            bgColor={color}
            sx={{ borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl }}
          />
          <MDBox ml={4} lineHeight={0}>
            <MDTypography
              align="center"
              variant="h5"
              textTransform="capitalize"
              fontWeight="medium"
            >
              {name}
            </MDTypography>
          </MDBox>
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
        </MDBox>
        <MDBox my={2} lineHeight={1} display="flex" alignItems="center" justifyContent="center">
          <Icon>mail</Icon>
          <MDTypography variant="subtitle2" ml={1}>
            {description}
          </MDTypography>
        </MDBox>
        {location && (
          <MDBox
            my={2}
            lineHeight={1}
            display="flex"
            alignItems="center"
            justifyContent="space-around"
          >
            <MDBox display="flex" alignItems="center">
              <Icon color="info">public</Icon>
              <MDTypography color="info" variant="subtitle2" ml={1}>
                {location}
              </MDTypography>
            </MDBox>
            <MDBox>
              <MDBadge
                variant="gradient"
                size="lg"
                color={approval_status ? "success" : "primary"}
                badgeContent={
                  approval_status ? (
                    <>
                      <Icon>check</Icon>&nbsp;Approved For Project
                    </>
                  ) : (
                    <>
                      <Icon>warning_amber</Icon>&nbsp;Not Approved
                    </>
                  )
                }
              />
            </MDBox>
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

// Declaring default props for ComplexProjectCard
PersonCard.defaultProps = {
  color: "dark",
  dropdown: false,
};

export default PersonCard;
