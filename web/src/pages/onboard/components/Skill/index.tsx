import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// NewUser page components
import FormField from "../FormField";

function Profile({ formData }: any): JSX.Element {
  const { formField, values } = formData;
  const { note } = formField;
  const { note: noteV } = values;

  return (
    <MDBox p={3}>
      <MDTypography variant="h5" fontWeight="bold">
        Note
      </MDTypography>
      <MDBox mt={1.625}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <FormField
              type={note.type}
              label={note.label}
              name={note.name}
              value={noteV}
              placeholder={note.placeholder}
              multiline={true}
              variant="outlined"
              rows={10}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default Profile;
