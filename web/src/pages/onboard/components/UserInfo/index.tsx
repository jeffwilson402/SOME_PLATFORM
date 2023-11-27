// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FormCheckBox from "../FormCheckBox";

// NewUser page components
import FormField from "../FormField";
import FormSelect from "../FormSelect";
import { UserTypes, JobTypes } from "interfaces/enums";

function UserInfo({ formData }: any): JSX.Element {
  const { formField, values, errors, touched, setFieldValue, readonly } = formData;
  const {
    firstName,
    lastName,
    type,
    email,
    jobType,
    telephone,
    personal_email,
    approved,
    location,
    timezone,
    language,
  } = formField;
  const {
    firstName: firstNameV,
    lastName: lastNameV,
    email: emailV,
    type: typeV,
    password: passwordV,
    repeatPassword: repeatPasswordV,
    approved: approvedV,
    jobType: jobTypeV,
    telephone: telephoneV,
    personal_email: personal_emailV,
    tenureStart: tenureStartV,
    tenureEnd: tenureEndV,
    location: locationV,
    timezone: timezoneV,
    language: languageV,
  } = values;
  console.log(values, errors);
  return (
    <MDBox p={3}>
      <MDBox lineHeight={0}>
        <MDTypography variant="h5">Personal Information</MDTypography>
      </MDBox>
      <MDBox mt={1.625}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              disabled={readonly}
              type={firstName.type}
              label={firstName.label}
              name={firstName.name}
              value={firstNameV}
              placeholder={firstName.placeholder}
              error={errors.firstName && touched.firstName}
              success={firstNameV.length > 0 && !errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              disabled={readonly}
              type={lastName.type}
              label={lastName.label}
              name={lastName.name}
              value={lastNameV}
              placeholder={lastName.placeholder}
              error={errors.lastName && touched.lastName}
              success={lastNameV.length > 0 && !errors.lastName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              disabled={readonly}
              type={email.type}
              label={email.label}
              name={email.name}
              value={emailV}
              placeholder={email.placeholder}
              error={errors.email && touched.email}
              success={emailV.length > 0 && !errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormSelect
              disabled={readonly}
              setFieldValue={setFieldValue}
              value={typeV}
              name={type.name}
              label={type.label}
              options={[UserTypes.CORE, UserTypes.ENGINEER, UserTypes.CLIENT]}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              disabled={readonly}
              type={personal_email.type}
              label={personal_email.label}
              name={personal_email.name}
              value={personal_emailV}
              placeholder={personal_email.placeholder}
              error={errors.personal_email && touched.personal_email}
              success={personal_emailV && personal_emailV.length > 0 && !errors.personal_email}
              inputProps={{ autoComplete: "" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              disabled={readonly}
              type={telephone.type}
              label={telephone.label}
              name={telephone.name}
              value={telephoneV}
              placeholder={telephone.placeholder}
              inputProps={{ autoComplete: "" }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormSelect
              disabled={readonly}
              setFieldValue={setFieldValue}
              value={locationV}
              name={location.name}
              label={location.label}
              options={["US", "UK"]}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormSelect
              disabled={readonly}
              setFieldValue={setFieldValue}
              value={languageV}
              name={language.name}
              label={language.label}
              options={["English", "Arabic"]}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormSelect
              disabled={readonly}
              setFieldValue={setFieldValue}
              value={timezoneV}
              name={timezone.name}
              label={timezone.label}
              options={["UTC", "UTC - 1"]}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormCheckBox
              disabled={readonly}
              {...approved}
              value={approvedV}
              setFieldValue={setFieldValue}
            />
          </Grid>
          {approvedV && (
            <Grid item xs={12} sm={6}>
              <FormSelect
                disabled={readonly}
                setFieldValue={setFieldValue}
                value={jobTypeV}
                name={jobType.name}
                label={jobType.label}
                options={[
                  JobTypes.FULL,
                  JobTypes.PART,
                  JobTypes.CONTRACT,
                  JobTypes.TEMPORARY,
                  JobTypes.INTERSHIP,
                ]}
              />
            </Grid>
          )}
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default UserInfo;
