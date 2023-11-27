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
  project?: IProject;
  mode?: string;
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
  const { project, open, mode, handleClose, handleChange, save } = props;
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [logoData, setLogoData] = useState(null);
  const handleSave = () => {
    try {
      setSaving(true);
      save();
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = (e: any) => {
    getBase64(e.target.files[0], (result: string) => {
      console.log(e.target.files[0].name, result);
      setLogoData(result);
      handleChange(result, "logo");
    });
  };

  return (
    <div>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} fullWidth>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {project?._id ? "Edit Project" : "New Project"}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {!mode && (
              <>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <MDInput
                    style={{ width: "100%" }}
                    label="Project Name"
                    value={project?.name}
                    onChange={(e: any) => handleChange(e.target.value, "name")}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <MDInput
                    style={{ width: "100%" }}
                    label="Project Code"
                    value={project?.code}
                    onChange={(e: any) => handleChange(e.target.value, "code")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MDInput
                    select
                    value={project ? project.type : ProjectTypes.FIXED_OUTCOME}
                    label="Project Type"
                    SelectProps={{
                      native: true,
                    }}
                    style={{ width: "100%" }}
                    onChange={(e: any) => handleChange(e.target.value, "type")}
                  >
                    <option value={ProjectTypes.FIXED_OUTCOME}>{ProjectTypes.FIXED_OUTCOME}</option>
                    <option value={ProjectTypes.MANAGED_OUTCOME}>
                      {ProjectTypes.MANAGED_OUTCOME}
                    </option>
                    <option value={ProjectTypes.MANAGED_PROJECT}>
                      {ProjectTypes.MANAGED_PROJECT}
                    </option>
                  </MDInput>
                </Grid>
                <Grid item xs={12}>
                  <MDInput
                    multiline
                    rows={5}
                    style={{ width: "100%" }}
                    label="Description"
                    value={project?.description}
                    onChange={(e: any) => handleChange(e.target.value, "description")}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <MDAvatar
                src={project?.logo || ProjectPlaceholder}
                size="xl"
                variant="rounded"
                bgColor="light"
                onClick={() => fileRef.current.click()}
                sx={{ borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl }}
              />
              <input
                type="file"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={handleLogoChange}
              />
              {/* <MDDropzone options={{ addRemoveLinks: true }} /> */}
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
