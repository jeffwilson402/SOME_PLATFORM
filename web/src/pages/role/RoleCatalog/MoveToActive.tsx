import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MDInput from "components/MDInput";

interface IProps {
  open: boolean;
  roleName: string;
  title: string;
  handleClose: () => void;
  moveToActiveRole: (name: string) => void;
}
function moveToActive({
  open,
  roleName,
  title,
  moveToActiveRole,
  handleClose,
}: IProps): JSX.Element {
  const [name, setName] = useState(roleName);
  console.log(roleName);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{title}</DialogContentText>
          <MDInput
            fullWidth
            variant="standard"
            label="Role Name"
            value={name || roleName}
            onChange={(e: any) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => moveToActiveRole(name)} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default moveToActive;
