/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { permissionList } from "../../context/constants";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import axios from "utils/axios";
import { toast } from "react-toastify";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

interface DialogProps {
  editingMember?: any;
  open: boolean;
  handleClose: () => void;
  // handleChange: (event: any, field: string) => void;
  save: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

function Permission(props: DialogProps): JSX.Element {
  const { editingMember, open, handleClose } = props;
  const [permission, setPermission] = useState(open?editingMember?.permission:undefined);
  const [saving, setSaving] = useState(false);
  const handleChange = (e: any, field: string) => {
    if (field === "global_admin") {
      const allChecked: any = {};
      permissionList.forEach((item) => (allChecked[item.key] = e.target.checked));
      setPermission(allChecked);
    } else {
      setPermission({
        ...permission,
        [field]: e.target.checked,
      });
    }
  };
  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.post("/user/permission", { _id: editingMember._id, permission });
      toast.success("Saved Permission Successfully!");
    } finally {
      setSaving(false);
    }
  };
  useEffect(() => {
    setPermission(editingMember?.permission);
  }, [editingMember]);
  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Edit Permissions For {editingMember?.firstName} {editingMember?.lastName}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid container spacing={1}>
            {permissionList.map((item) => (
              <Grid item xs={12} key={item.key}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={permission && permission[item.key]}
                        onChange={(e: any) => handleChange(e, item.key)}
                      />
                    }
                    label={item.label}
                  />
                  <MDBox px={4}>
                    <MDTypography variant="subtitle2">{item.caption}</MDTypography>
                  </MDBox>
                </FormGroup>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSave} disabled={saving}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

Permission.defaultProps = {
  project: undefined,
};
export default Permission;
