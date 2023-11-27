// formik components
import { ErrorMessage, Field } from "formik";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import React from "react";

// Declaring props types for FormField
interface Props {
  label: string;
  name: string;
  disabled?: boolean;
  value?: string | number | Date;
  type: string;
  [key: string]: any;
}

function FormField({ label, name, disabled, value, type, ...rest }: Props): JSX.Element {
  return (
    <MDBox mb={1.5}>
      <Field
        variant="standard"
        {...rest}
        type={type}
        name={name}
        as={MDInput}
        label={label}
        disabled={disabled}
        value={value}
        fullWidth
      />
      <MDBox mt={0.75}>
        <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

export default FormField;
