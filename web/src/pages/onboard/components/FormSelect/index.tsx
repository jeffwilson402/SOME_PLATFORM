// formik components
import { useEffect } from "react";
import { ErrorMessage, Field } from "formik";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Autocomplete from "@mui/material/Autocomplete";

// Declaring props types for FormField
interface Props {
  label: string;
  name: string;
  options: string[] | Record<string, string>[];
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  [key: string]: any;
}

function FormSelect(props: Props): JSX.Element {
  const { label, options, name, multiple, setFieldValue, ...rest } = props;
  useEffect(() => {
    if (!rest.value && !multiple) setFieldValue(name, options[0]);
  }, []);
  return (
    <MDBox mb={1.5}>
      <Field
        {...rest}
        value={rest.value || options[0]}
        name={name}
        multiple={multiple}
        as={Autocomplete}
        options={options}
        fullWidth
        renderInput={(params: any) => <MDInput {...params} variant="standard" label={label} />}
        onChange={(e: any, value: any) => {
          setFieldValue(name, value);
        }}
        // disableClearable={true}
      />
      <MDBox mt={0.75}>
        <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

export default FormSelect;
