/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { TDocument, IProject } from "interfaces";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "utils/axios";
import { toast } from "react-toastify";
import { confirm } from "react-confirm-box";
import { dialogRender } from "utils/confirmDialog";
import download from "js-file-download";
import { useBackdrop } from "context/backdrop";
import { fileSizeLimit } from "constants/index";
import { mbToBytes } from "utils";

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
  parent_id: string;
  open: boolean;
  getUrl: string;
  deleteUrl: string;
  uploadUrl: string;
  downloadUrl: string;
  handleClose: () => void;
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

function DocumentDialog(props: DialogProps): JSX.Element {
  const { parent_id, open, getUrl, deleteUrl, uploadUrl, downloadUrl, handleClose } = props;
  const { fetching } = useBackdrop();
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState<TDocument[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const fileAcceptTypes =
    "application/rtf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,application/vnd.ms-excel,image/png,image/jpeg,image/jpg,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const handleFileChange = (e: ChangeEvent) => {
    const file = (e.target as HTMLInputElement).files[0];
    if (file.size > mbToBytes(fileSizeLimit)) {
      toast.warn(`File should be less than ${fileSizeLimit}MB!`);
      return;
    }
    setFile(file);
  };
  const handleUpload = async () => {
    try {
      let formData = new FormData();
      formData.append("_id", parent_id);
      formData.append("file", file);
      fetching(true);
      await axios.post(uploadUrl, formData);
      toast.success("Uploaded File Successfully!");
      setFile(null);
      fileRef.current.files = null;
      getProject();
    } catch (error) {
    } finally {
      fetching(false);
    }
  };
  const handleChangeDocuments = (documents: TDocument[]) => {
    const temp = documents.map((p) => ({
      file_id: p.file_id,
      file_name: p.file_name,
      uploadedAt: p.uploadedAt?.substring(0, 10),
      actions: (
        <MDBox display="flex" justifyContent="space-between">
          <MDButton
            color="info"
            style={{ marginRight: 3 }}
            iconOnly
            onClick={() => handleDownload(parent_id, p.file_id, p.file_name)}
          >
            <Icon>download</Icon>
          </MDButton>
          <MDButton
            color="primary"
            iconOnly
            onClick={() => handleDocumentDelete(dialogRender, p.file_id)}
          >
            <Icon>delete</Icon>
          </MDButton>
        </MDBox>
      ),
    }));
    setDocuments(temp);
  };
  const handleDownload = async (_id: string, file_id: string, file_name: string) => {
    try {
      const { data } = await axios.post(downloadUrl, { _id, file_id }, { responseType: "blob" });
      download(data, file_name);
    } catch (error) {
      toast.warn("Something Went Wrong!");
    }
  };

  const handleDocumentDelete = async (options: any, _id: string) => {
    try {
      const result = await confirm("Are you sure to delete this document?", options);
      if (result) {
        const { data } = await axios.post(deleteUrl, {
          _id: parent_id,
          doc_id: _id,
        });
        toast.success("Deleted A Document Successfully!");
        handleChangeDocuments(data.documents || data.files);
      }
    } catch (error) {
      toast.warn("Internal Server Error!");
    }
  };

  const getProject = async () => {
    try {
      fetching(true);
      const { data } = await axios.get(`${getUrl}/${parent_id}`);
      handleChangeDocuments(data.documents || data.files);
    } catch (error) {
      toast.warn("Internal Server Error!");
    } finally {
      fetching(false);
    }
  };

  useEffect(() => {
    if (open) {
      getProject();
    }
  }, [open]);
  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Upload Documents
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid container>
            <Grid item xs={9}>
              <MDBox px={3}>
                <MDInput
                  label="Click Here To Upload File"
                  value={file?.name || ""}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MDButton onClick={() => fileRef.current.click()} iconOnly>
                          <Icon>attach_file</Icon>
                        </MDButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <input
                  type="file"
                  ref={fileRef}
                  accept={fileAcceptTypes}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </MDBox>
            </Grid>
            <Grid item xs={3}>
              <MDButton color="info" onClick={handleUpload} disabled={file === null}>
                <Icon>upload</Icon>&nbsp;Upload
              </MDButton>
            </Grid>
            <Grid item xs={12}>
              <DataTable
                table={{
                  columns: [
                    { Header: "File Name", accessor: "file_name" },
                    { Header: "Uploaded At", accessor: "uploadedAt", width: "30%" },
                    { Header: "Actions", accessor: "actions", width: "30%" },
                  ],
                  rows: documents || [],
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

DocumentDialog.defaultProps = {
  project: undefined,
};
export default DocumentDialog;
