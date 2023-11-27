import { Autocomplete, TextField } from "@mui/material";
import MDBox from "components/MDBox";

interface IProps {
  label: string;
  value: any;
  placeholder: string;
  options: string[];
  onChange?: (e: any, newValue: string[]) => void;
}
function Select(props: IProps): JSX.Element {
  const { label, placeholder, value, options, onChange } = props;
  return (
    <Autocomplete
      fullWidth
      multiple
      options={options}
      value={value}
      onChange={onChange}
      renderInput={(params) => (
        <TextField {...params} variant="standard" label={label} placeholder={placeholder} />
      )}
    />
  );
}

export default Select;
