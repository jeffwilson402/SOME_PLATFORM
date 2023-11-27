import { Autocomplete, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import { ChangeEventHandler } from "react";

interface IProps {
  label: string;
  value: any;
  placeholder: string;
  options: string[];
  onChange?: React.ReactEventHandler<HTMLDivElement>;
}
function Select(props: IProps): JSX.Element {
  const { label, placeholder, value, options, onChange } = props;
  return (
    <Autocomplete
      fullWidth
      options={options}
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          onSelect={onChange}
          variant="standard"
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
}

export default Select;
