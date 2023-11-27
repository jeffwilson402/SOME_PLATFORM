/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import FormCheckBox from "../FormCheckBox";

// NewUser page components
import FormField from "../FormField";
import FormSelect from "../FormSelect";

function CompanyInfo({ formData }: any): JSX.Element {
  const { formField, values, errors, touched, setFieldValue, readonly } = formData;
  const { hasOwnCompany, companyName, companyAddress, companyPhone, companyVat, companyId } =
    formField;
  const {
    hasOwnCompany: hasOwnCompanyV,
    companyName: companyNameV,
    companyAddress: companyAddressV,
    companyPhone: companyPhoneV,
    companyVat: companyVatV,
    companyId: companyIdV,
  } = values;
  console.log(values, errors);
  return (
    <MDBox p={3}>
      <MDBox lineHeight={0}>
        <MDTypography variant="h5">ETM Company Information</MDTypography>
        <MDTypography variant="button" color="text">
          Mandatory informations
        </MDTypography>
      </MDBox>
      <MDBox mt={1.625}>
        <Grid container spacing={3}>
          <>
            <Grid item xs={12} sm={6}>
              <FormCheckBox
                disabled={readonly}
                {...hasOwnCompany}
                value={hasOwnCompanyV}
                setFieldValue={setFieldValue}
              />
            </Grid>
            {hasOwnCompanyV && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormField
                    disabled={readonly}
                    type={companyName.type}
                    label={companyName.label}
                    name={companyName.name}
                    value={companyNameV}
                    placeholder={companyName.placeholder}
                    error={errors.companyName && touched.companyName}
                    success={companyNameV && !errors.companyName}
                    inputProps={{ autoComplete: "" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    disabled={readonly}
                    type={companyAddress.type}
                    label={companyAddress.label}
                    name={companyAddress.name}
                    value={companyAddressV}
                    error={errors.companyAddress && touched.companyAddress}
                    success={companyAddressV && !errors.companyAddress}
                    inputProps={{ autoComplete: "" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    disabled={readonly}
                    type={companyPhone.type}
                    label={companyPhone.label}
                    name={companyPhone.name}
                    value={companyPhoneV}
                    placeholder={companyPhone.placeholder}
                    error={errors.companyPhone && touched.companyPhone}
                    success={companyPhoneV && !errors.companyPhone}
                    inputProps={{ autoComplete: "" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    disabled={readonly}
                    type={companyVat.type}
                    label={companyVat.label}
                    name={companyVat.name}
                    value={companyVatV}
                    placeholder={companyVat.placeholder}
                    error={errors.companyVat && touched.companyVat}
                    success={companyNameV && !errors.companyVat}
                    inputProps={{ autoComplete: "" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    disabled={readonly}
                    type={companyId.type}
                    label={companyId.label}
                    name={companyId.name}
                    value={companyIdV}
                    placeholder={companyId.placeholder}
                    error={errors.companyId && touched.companyId}
                    success={companyIdV && !errors.companyId}
                    inputProps={{ autoComplete: "" }}
                  />
                </Grid>
              </>
            )}
          </>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default CompanyInfo;
