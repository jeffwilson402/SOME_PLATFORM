// import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import { toast } from "react-toastify";
import axios from "utils/axios";
import { IProject, ProjectTypes } from "interfaces";
import { useBackdrop } from "context/backdrop";
import NewDialog from "./NewDialog";
import ProjectCard from "./ProjectCard";
import { confirm } from "react-confirm-box";
import { dialogRender } from "utils/confirmDialog";
import DocumentDialog from "./DocumentDialog";

const renderMenu = (
  state: any,
  close: any,
  editProject: any,
  handleEditLogo: () => void,
  deleteProject: any,
  handleOpenDocument: () => void,
  handleManageTeam: () => void
) => (
  <Menu
    anchorEl={state}
    anchorOrigin={{ vertical: "top", horizontal: "left" }}
    transformOrigin={{ vertical: "top", horizontal: "left" }}
    open={Boolean(state)}
    onClose={close}
    keepMounted
  >
    <MenuItem onClick={handleManageTeam}>
      <Icon color="info">calendar_month</Icon>
      <MDTypography ml={1} color="info" variant="button">
        Manage Team
      </MDTypography>
    </MenuItem>
    <MenuItem onClick={editProject}>
      <Icon color="success">edit</Icon>
      <MDTypography ml={1} color="success" variant="button">
        Edit Project
      </MDTypography>
    </MenuItem>
    <MenuItem onClick={handleOpenDocument}>
      <Icon color="success">security</Icon>
      <MDTypography ml={1} color="success" variant="button">
        Project Documents
      </MDTypography>
    </MenuItem>
    <MenuItem onClick={handleEditLogo}>
      <Icon color="success">security</Icon>
      <MDTypography ml={1} color="success" variant="button">
        Project Logo
      </MDTypography>
    </MenuItem>
    <MenuItem onClick={deleteProject}>
      <Icon color="error">delete</Icon>
      <MDTypography ml={1} color="error" variant="button">
        Delete Project
      </MDTypography>
    </MenuItem>
  </Menu>
);

function Project(): JSX.Element {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject>(undefined);
  const [saving, setSaving] = useState<boolean>(false);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [editMode, setEditMode] = useState(null);
  const navigate = useNavigate();

  const openCardMenu = (event: any, project: IProject) => {
    setEditingProject(project);
    setOpenMenu(event.currentTarget);
  };
  const closeMenu = () => {
    setOpenMenu(false);
  };
  const { fetching } = useBackdrop();
  const handleOpenNew = () => {
    setEditingProject({ type: ProjectTypes.FIXED_OUTCOME } as IProject);
    setOpenDialog(true);
  };
  const handleProjectChange = (value: string, field: string) => {
    setEditingProject({
      ...editingProject,
      [field]: value,
    });
  };
  const handleManageTeam = () => {
    navigate(`/projects/${editingProject._id}/manage_team`);
  };
  const handleOpenDocument = () => {
    closeMenu();
    setEditMode(null);
    setOpenDocumentDialog(true);
  };
  const handleEditLogo = () => {
    closeMenu();
    setEditMode("logo");
    setOpenDialog(true);
  };

  const getAllProjects = async () => {
    try {
      fetching(true);
      const { data } = await axios.post("/project/all");
      // const { data } = await Axios().get("/project/all");
      setProjects(data);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      fetching(false);
    }
  };
  const editProject = () => {
    console.log(editingProject);
    closeMenu();
    setOpenDialog(true);
  };
  const deleteProject = async (options: any) => {
    closeMenu();
    const result = await confirm("Are you sure to delete this project?", options);
    if (result) {
      try {
        await axios.delete(`/project/delete/${editingProject?._id}`);
        toast.success("Deleted Successfully!");
        getAllProjects();
      } catch (error) {}
      return;
    }
  };
  const saveProject = async () => {
    try {
      setSaving(true);
      console.log(editingProject);
      await axios.post("/project/save", editingProject);
      toast.success("Saved a Project Successfully!");
      setOpenDialog(false);
      getAllProjects();
    } catch (error: any) {
      toast.warn(error.response.data.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <MDButton variant="gradient" color="info" onClick={handleOpenNew} disabled={saving}>
          <Icon>add</Icon>&nbsp; New Project
        </MDButton>
        <Grid container spacing={2} mt={2}>
          {projects.map((project: IProject) => (
            <Grid item xs={12} sm={12} md={3} lg={3} key={project._id}>
              <ProjectCard
                color="light"
                image={project?.logo}
                name={project.name}
                project={project}
                editProject={editProject}
                editLogo={handleEditLogo}
                dropdown={{
                  action: (e: any) => openCardMenu(e, project),
                  menu: renderMenu(
                    openMenu,
                    closeMenu,
                    editProject,
                    handleEditLogo,
                    () => deleteProject(dialogRender),
                    handleOpenDocument,
                    handleManageTeam
                  ),
                }}
                code={project.code}
              />
            </Grid>
          ))}
        </Grid>
      </MDBox>
      <NewDialog
        mode={editMode}
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        project={editingProject}
        handleChange={handleProjectChange}
        save={saveProject}
      />
      <DocumentDialog
        parent_id={editingProject?._id}
        getUrl="/project"
        uploadUrl="/project/upload_file"
        deleteUrl="/project/delete_document"
        downloadUrl="/project/download_document"
        open={openDocumentDialog}
        handleClose={() => setOpenDocumentDialog(false)}
      />
    </DashboardLayout>
  );
}

export default Project;
