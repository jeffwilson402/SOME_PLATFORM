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
import { TextareaAutosize } from "@mui/material";
import Grid from "@mui/material/Grid";
import MDAlert from "components/MDAlert";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import React from "react";
import FormCheckBox from "../FormCheckBox";

// NewUser page components
import FormField from "../FormField";

function Profile({ formData }: any): JSX.Element {
  const { formField, values, errors, touched, setFieldValue, readonly } = formData;
  const {
    note,
    approved,
    hasOwnCompany,
    companyName,
    companyAddress,
    companyPhone,
    companyVat,
    companyId,
  } = formField;
  const {
    note: noteV,
    notes: notesV,
    type: typeV,
    approved: approvedV,
    hasOwnCompany: hasOwnCompanyV,
    companyName: companyNameV,
    companyAddress: companyAddressV,
    companyPhone: companyPhoneV,
    companyVat: companyVatV,
    companyId: companyIdV,
  } = values;

  return (
    <MDBox p={3}>
      <MDTypography variant="h5" fontWeight="bold">
        Note
      </MDTypography>
      <MDBox mt={1.625}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            {notesV?.map((note: any, index: number) => (
              <React.Fragment key={index}>
                <MDTypography variant="caption">{note.createdAt.substring(0, 10)}</MDTypography>
                <MDAlert color="info">
                  <MDTypography color="light">{note.note}</MDTypography>
                </MDAlert>
              </React.Fragment>
            ))}
          </Grid>
          <Grid item xs={12}>
            <FormField
              disabled={readonly}
              type={note.type}
              label={note.label}
              name={note.name}
              value={noteV}
              placeholder={note.placeholder}
              multiline={true}
              variant="outlined"
              rows={5}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default Profile;
