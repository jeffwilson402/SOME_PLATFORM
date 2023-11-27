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
import { IProject, ProjectTypes } from "interfaces";
import MDAvatar from "components/MDAvatar";
import ProjectPlaceholder from "assets/images/custom/project_placeholder.png";
import getBase64 from "utils/base64";
import MDDropzone from "components/MDDropzone";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

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
  teamMember: any;
  open: boolean;
  handleClose: () => void;
  //   handleChange: (event: any, field: string) => void;
  save: (startDate: Date, endDate: Date) => void;
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

function EditTeamMember(props: DialogProps): JSX.Element {
  const { teamMember, open, handleClose, save } = props;
  console.log(teamMember)
  const [saving, setSaving] = useState(false);
  const [startDate, setStartDate] = useState(teamMember?.startDate.substring(0, 10));
  const [endDate, setEndDate] = useState(teamMember?.endDate.substring(0, 10));

  const handleSave = async () => {
    try {
      setSaving(true);
      save(startDate, endDate);
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };
  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Edit {teamMember?.email}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <MDBox display="flex">
            <MDBox mr={3}>
              <MDTypography variant="subtitle2">Start Date</MDTypography>
              <MDInput
                type="date"
                value={startDate}
                onChange={(e: any) => setStartDate(e.target.value)}
              />
            </MDBox>
            <MDBox>
              <MDTypography variant="subtitle2">End Date</MDTypography>
              <MDInput
                type="date"
                value={endDate}
                onChange={(e: any) => setEndDate(e.target.value)}
              />
            </MDBox>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button autoFocus disabled={saving} onClick={handleSave}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default EditTeamMember;
