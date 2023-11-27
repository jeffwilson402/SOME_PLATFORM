import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface IProps {
  message: string;
  onConfirm: any;
  onCancel: any;
}
export default function ConfirmDialog({ message, onConfirm, onCancel }: IProps) {
  return (
    <div>
      <Dialog
        open={true}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export const dialogRender = {
  render: (message: string, onConfirm: any, onCancel: any) => {
    return (
      <>
        <ConfirmDialog message={message} onCancel={onCancel} onConfirm={onConfirm} />
      </>
    );
  },
};
