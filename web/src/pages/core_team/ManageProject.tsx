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
import { Autocomplete, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { permissionList } from "../../context/constants";
import axios from "utils/axios";
import { toast } from "react-toastify";
import MDInput from "components/MDInput";
import { useBackdrop } from "context/backdrop";

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

function ManageProject(props: DialogProps): JSX.Element {
  const { editingMember, open, handleClose } = props;
  const { fetching } = useBackdrop();
  const [projects, setProjects] = useState(open?editingMember?.projectDetail:undefined);
  const [projectOptions, setProjectOptions] = useState([]);
  const [saving, setSaving] = useState(false);
  const getProjects = async () => {
    try {
      fetching(true);
      const { data } = await axios.post("/project/all", { fields: ["_id", "name"] });
      setProjectOptions(data);
    } catch (error) {
    } finally {
      fetching(false);
    }
  };
  const handleSave = async () => {
    try {
      fetching(true)
      await axios.post("/user/manage_projects", { _id: editingMember._id, projects });
      toast.success("Saved Permission Successfully!");
    } finally {
      fetching(false);
    }
  };
  useEffect(() => {
    getProjects();
  }, []);
  useEffect(() => {
    setProjects(editingMember?.projectDetail);
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
          Manage Projects For {editingMember?.firstName} {editingMember?.lastName}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Autocomplete
            fullWidth
            multiple
            options={projectOptions}
            isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
            getOptionLabel={(option) => option.name}
            value={projects}
            onChange={(e: any, value) => setProjects(value)}
            renderInput={(params) => (
              <MDInput
                {...params}
                label="Choose Projects to Assign"
                variant="standard"
                size="medium"
              />
            )}
          />
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

export default ManageProject;
