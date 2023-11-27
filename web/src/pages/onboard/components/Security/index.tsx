import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FormCheckBox from "../FormCheckBox";
import FormSelect from "../FormSelect";

function Socials({ formData }: any): JSX.Element {
  const { formField, values, errors, touched, setFieldValue, readonly } = formData;
  const { bpss, ctc, sc, esc, dv, edv, location, timezone, language } = formField;
  const {
    bpss: bpssV,
    ctc: ctcV,
    sc: scV,
    esc: escV,
    dv: dvV,
    edv: edvV,
    type: typeV,
    location: locationV,
    timezone: timezoneV,
    language: languageV,
  } = values;
  return (
    <MDBox p={3}>
      <MDTypography variant="h5" fontWeight="bold">
        Security
      </MDTypography>
      <MDBox mt={1.625}>
        <Grid container>
          {typeV === "Engineer" && (
            <Grid item xs={12} sm={6}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormCheckBox {...bpss} disabled={readonly} value={bpssV} setFieldValue={setFieldValue} />
                </Grid>
                <Grid item xs={12}>
                  <FormCheckBox {...ctc} disabled={readonly} value={ctcV} setFieldValue={setFieldValue} />
                </Grid>
                <Grid item xs={12}>
                  <FormCheckBox {...sc} disabled={readonly} value={scV} setFieldValue={setFieldValue} />
                </Grid>
                <Grid item xs={12}>
                  <FormCheckBox {...esc} disabled={readonly} value={escV} setFieldValue={setFieldValue} />
                </Grid>
                <Grid item xs={12}>
                  <FormCheckBox {...dv} disabled={readonly} value={dvV} setFieldValue={setFieldValue} />
                </Grid>
                <Grid item xs={12}>
                  <FormCheckBox {...edv} disabled={readonly} value={edvV} setFieldValue={setFieldValue} />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default Socials;
