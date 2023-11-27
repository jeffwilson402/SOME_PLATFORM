import { useEffect } from "react";
import { ErrorMessage, Field } from "formik";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import { CheckboxWithLabel } from "formik-material-ui";
// Declaring props types for FormField
interface Props {
  label: string;
  name: string;
  value: boolean;
  disabled?: boolean;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  [key: string]: any;
}

function FormCheckBox({
  label,
  value,
  name,
  setFieldValue,
  disabled,
  ...rest
}: Props): JSX.Element {
  useEffect(() => {
    setFieldValue(name, value);
  }, []);
  const handleChange = () => {
    if (name === "approved") setFieldValue("jobType", "");
    setFieldValue(name, !value);
  };
  if (disabled) {
    return (
      <MDBox>
        <h6>
          {label}: {value ? "checked" : "unchecked"}
        </h6>
      </MDBox>
    );
  }
  return (
    <MDBox>
      <Field
        type="checkbox"
        {...rest}
        name={name}
        component={CheckboxWithLabel}
        Label={{ label }}
        checked={value}
        onChange={handleChange}
      />
    </MDBox>
  );
}

export default FormCheckBox;
