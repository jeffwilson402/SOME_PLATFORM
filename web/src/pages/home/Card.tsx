// @mui material components
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Declaring prop types for the ComplexProjectCard
interface Props {
  image: string;
  title: string;
  link: string;
  [key: string]: any;
}

// Custom styles for ComplexProjectCard
function NavCard({ image, title, link }: Props): JSX.Element {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(link)} style={{ cursor: "pointer" }}>
      <MDBox p={2}>
        <MDBox display="flex" justifyContent="center" alignItems="center">
          <MDAvatar
            src={image}
            alt={title}
            size="xl"
            variant="rounded"
            sx={{ p: 1, borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl }}
          />
        </MDBox>
        <MDBox lineHeight={0}>
          <MDTypography align="center" variant="h5" textTransform="capitalize" fontWeight="medium">
            {title}
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default NavCard;
