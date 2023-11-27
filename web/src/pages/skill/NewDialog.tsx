/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MDInput from "components/MDInput";
import Grid from "@mui/material/Grid";
import { ISkill, ProjectTypes } from "interfaces";
import MDAvatar from "components/MDAvatar";
import ProjectPlaceholder from "assets/images/custom/project_placeholder.png";
import getBase64 from "utils/base64";
import MDDropzone from "components/MDDropzone";

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
  title?: string;
  skill?: ISkill;
  open: boolean;
  handleClose: () => void;
  handleChange: (event: any, field: string) => void;
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

function NewDialog(props: DialogProps): JSX.Element {
  const { title, skill, open, handleClose, handleChange, save } = props;
  const [saving, setSaving] = useState(false);
  const handleSave = () => {
    try {
      setSaving(true);
      save();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {title ? title : skill?._id ? "Edit Skill" : "New Skill"}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MDInput
                style={{ width: "100%" }}
                label="Name"
                value={skill?.name || ""}
                onChange={(e: any) => handleChange(e.target.value, "name")}
              />
            </Grid>
            <Grid item xs={12}>
              <MDInput
                multiline
                rows={5}
                style={{ width: "100%" }}
                label="Description"
                value={skill?.description || ""}
                onChange={(e: any) => handleChange(e.target.value, "description")}
              />
            </Grid>
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

NewDialog.defaultProps = {
  project: undefined,
};
export default NewDialog;
