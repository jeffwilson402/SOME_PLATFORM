import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDInput from "components/MDInput";
import { useEffect, useMemo, useState } from "react";
import { Autocomplete, Card, Checkbox, Icon, Menu, MenuItem, TextField } from "@mui/material";
import MDTypography from "components/MDTypography";
import Select from "./Select";
import axios from "utils/axios";
import { ISkill } from "interfaces";
import { dialogRender } from "utils/confirmDialog";
import { confirm } from "react-confirm-box";
import { security_clearances, sources } from "./values";
import { toast } from "react-toastify";
import PersonCard from "pages/core_team/PersonCard";
import { useBackdrop } from "context/backdrop";
import DocumentDialog from "pages/project/DocumentDialog";
import CustomCollapse from "pages/role/RoleCatalog/Collapse";
import { AgencyTypes } from "interfaces/enums";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";
import MDBadge from "components/MDBadge";

const renderMenu = (
  state: any,
  close: any,
  handleManageFiles: () => void,
  handleAddSkills: () => void,
  handleAddRoles: () => void,
  handleReviewSkills: () => void,
  handleEditUser: () => void,
  handleViewUser: () => void,
  deleteTalent: () => void
) => (
  <Menu
    anchorEl={state}
    anchorOrigin={{ vertical: "top", horizontal: "left" }}
    transformOrigin={{ vertical: "top", horizontal: "right" }}
    open={Boolean(state)}
    onClose={close}
    keepMounted
  >
    <MenuItem onClick={handleViewUser}>
      <Icon color="info">contact_page</Icon>
      <MDTypography ml={1} color="info" variant="button">
        View ETM Profile
      </MDTypography>
    </MenuItem>
    <MenuItem onClick={handleAddSkills}>
      <Icon color="info">workspace_premium</Icon>
      <MDTypography ml={1} color="info" variant="button">
        Add Skills
      </MDTypography>
    </MenuItem>
    <MenuItem onClick={handleAddRoles}>
      <Icon color="info">group_add</Icon>
      <MDTypography ml={1} color="info" variant="button">
        Add Roles
      </MDTypography>
    </MenuItem>
    <MenuItem onClick={handleReviewSkills}>
      <Icon color="info">tune</Icon>
      <MDTypography ml={1} color="info" variant="button">
        Review/Adjust Skills
      </MDTypography>
    </MenuItem>
    <MenuItem onClick={handleManageFiles}>
      <Icon color="info">file_copy</Icon>
      <MDTypography ml={1} color="info" variant="button">
        Manage Files
      </MDTypography>
    </MenuItem>
    <MenuItem onClick={deleteTalent}>
      <Icon color="error">delete</Icon>
      <MDTypography ml={1} color="error" variant="button">
        Delete User
      </MDTypography>
    </MenuItem>
  </Menu>
);
function ElasticBoard(): JSX.Element {
  const { fetching } = useBackdrop();
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [skillOptions, setSkillOptions] = useState<ISkill[]>([]);
  const [skills, setSkills] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [clearances, setClearances] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [approval, setApproval] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [editingTalent, setEditingTalent] = useState(undefined);
  const [talents, setTalents] = useState([]);
  const [sourceIds, setSourceIds] = useState([]);

  const handleOpenMenu = (e: any, talent: any) => {
    setOpenMenu(e.currentTarget);
    console.log(e.currentTarget);
    setEditingTalent(talent);
  };

  const handleAddSkills = () => {
    navigate(`/elastic_talent_board/${editingTalent._id}/add_skills`);
  };
  const handleAddRoles = () => {
    navigate(`/elastic_talent_board/${editingTalent._id}/add_roles`);
  };
  const handleReviewSkills = () => {
    navigate(`/elastic_talent_board/${editingTalent._id}/review_skills`);
  };
  const handleEditUser = () => {
    navigate(`/elastic_talent_board/${editingTalent._id}/edit`);
  };
  const handleViewUser = () => {
    navigate(`/elastic_talent_board/${editingTalent._id}/view`);
  }
  const getSkillOptions = async () => {
    try {
      const { data } = await axios.post("/skill/options", { search: "" });
      setSkillOptions(data);
    } catch (error) {}
  };

  const getProjectOptions = async () => {
    try {
      const { data } = await axios.post("/project/all", { fields: ["_id", "name"] });
      setProjectOptions(data);
    } catch (error) {}
  };

  const getTalents = async () => {
    try {
      fetching(true);
      const source = sourceIds.map((id:any)=>id.value);
      const { data } = await axios.post("/user/talent/all", {
        name,
        skills,
        locations,
        projects,
        agencies,
        clearances,
        languages,
        approval,
        sourceIds:source,
      });
      setTalents(data);
    } catch (error: any) {
      toast.warn(error.message);
    } finally {
      fetching(false);
    }
  };

  const talentData = useMemo(() => {
    return talents.map((talent) => ({
      ...talent,
      name: `${talent.firstName} ${talent.lastName}`,
      approved: (
        <MDBadge
          variant="gradient"
          size="lg"
          color={talent.approved ? "success" : "primary"}
          badgeContent={
            talent.approved ? (
              <>
                <Icon>check</Icon>&nbsp;Approved For Project
              </>
            ) : (
              <>
                <Icon>warning_amber</Icon>&nbsp;Not Approved
              </>
            )
          }
        />
      ),
      actions: (
        <MDBox>
          <MDTypography color="secondary" onClick={(e: any) => handleOpenMenu(e, talent)}>
            <Icon sx={{ cursor: "pointer", fontWeight: "bold" }}>more_vert</Icon>
          </MDTypography>
        </MDBox>
      ),
    }));
  }, [talents]);

  const deleteTalent = async (options: any) => {
    try {
      setOpenMenu(false);
      const result = await confirm("Are you sure to delete this talent?", options);
      if (result) {
        await axios.delete(`/user/${editingTalent._id}`);
        getTalents();
        toast.success("Deleted A Talent Successfully!");
      }
    } catch (error: any) {
      toast.warn(error.message);
    }
  };
  useEffect(() => {
    getSkillOptions();
    getProjectOptions();
    getTalents();
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <Grid container>
          <Grid item xs={12}>
            <CustomCollapse
              title="Filter"
              open={filterOpen}
              onClick={() => setFilterOpen((open) => !open)}
            >
              <Card>
                <MDBox p={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <MDInput
                        type="text"
                        label="Search By Name"
                        fullWidth
                        value={name}
                        variant="standard"
                        onChange={(e: any) => setName(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        fullWidth
                        multiple
                        options={projectOptions}
                        getOptionLabel={(option) => option.name}
                        value={projects}
                        onChange={(e: any, value) => setProjects(value)}
                        renderInput={(params) => (
                          <MDInput
                            {...params}
                            label="Search By Project"
                            variant="standard"
                            size="medium"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Select
                        options={["UK", "US"]}
                        label="Search By Location"
                        value={locations}
                        placeholder="Choose Locations"
                        onChange={(e: any, newValue: string[]) => setLocations(newValue)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        fullWidth
                        filterSelectedOptions
                        multiple
                        isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
                        getOptionLabel={(option) => option.name}
                        options={skillOptions}
                        value={skills}
                        onChange={(e: any, newValue) => setSkills(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Search By Skill"
                            size="medium"
                            placeholder="Choose Skills"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Select
                        options={[
                          AgencyTypes.BARCLAY_SEARCH,
                          AgencyTypes.DIRECT,
                          AgencyTypes.TRILOGY,
                        ]}
                        value={agencies}
                        label="Search By Agencies"
                        placeholder="Choose Agencies"
                        onChange={(e: any, newValue: string[]) => setAgencies(newValue)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Select
                        options={["English", "French", "Italian"]}
                        label="Search By Languages"
                        placeholder="Choose Languages"
                        value={languages}
                        onChange={(e: any, newValue: string[]) => setLanguages(newValue)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        options={[
                          { value: true, label: "Approved For Projects" },
                          { value: false, label: "Not Approved" },
                        ]}
                        multiple
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option: any, value: any) =>
                          option.label === value.label
                        }
                        placeholder="Choose Status"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Search By Approval Status"
                            size="medium"
                            placeholder="Choose Status"
                          />
                        )}
                        value={approval}
                        onChange={(e: any, newValue: string[]) => setApproval(newValue)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        options={security_clearances}
                        multiple
                        value={clearances}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option: any, value: any) =>
                          option.label === value.label
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Search By Security Clearances"
                            placeholder="Choose Clearances"
                          />
                        )}
                        onChange={(e: any, newValue: string[]) => setClearances(newValue)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        options={sources}
                        multiple
                        value={sourceIds}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option: any, value: any) =>
                          option.value === value.value
                        }
                        renderInput={(params) => (
                          <TextField {...params} variant="standard" label="Search By Source" />
                        )}
                        onChange={(e: any, newValue: string[]) => setSourceIds(newValue)}
                      />
                    </Grid>
                  </Grid>
                  <MDBox display="flex" justifyContent="end" mt={2}>
                    <MDButton color="info" onClick={getTalents}>
                      <Icon>search</Icon>&nbsp;Filter
                    </MDButton>
                  </MDBox>
                </MDBox>
              </Card>
            </CustomCollapse>
          </Grid>
          <Grid item xs={12} p={2}>
            <Grid container spacing={2}>
              <DataTable
                table={{
                  columns: [
                    { Header: "Name", accessor: "name" },
                    { Header: "Email", accessor: "email" },
                    { Header: "Approved", accessor: "approved" },
                    { Header: "Location", accessor: "place.location" },
                    { Header: "Actions", accessor: "actions" },
                  ],
                  rows: talentData,
                }}
              />
              {renderMenu(
                openMenu,
                () => setOpenMenu(false),
                () => {
                  setOpenDocumentDialog(true);
                  setOpenMenu(false);
                },
                handleAddSkills,
                handleAddRoles,
                handleReviewSkills,
                handleEditUser,
                handleViewUser,
                () => deleteTalent(dialogRender)
              )}
              {/* {talents.map((talent) => (
                <Grid item xs={12} sm={4}>
                  <PersonCard
                    color="light"
                    image={null}
                    name={`${talent.firstName} ${talent.lastName}`}
                    description={talent.email}
                    location={talent.place.location}
                    approval_status={talent.approved}
                    dropdown={{
                      action: (e: any) => handleOpenMenu(e, talent),
                      menu: renderMenu(
                        openMenu,
                        () => setOpenMenu(false),
                        () => {
                          setOpenDocumentDialog(true);
                          setOpenMenu(false);
                        },
                        handleEditUser,
                        () => deleteTalent(dialogRender)
                      ),
                    }}
                  />
                </Grid>
              ))} */}
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
      <DocumentDialog
        parent_id={editingTalent?._id}
        getUrl="/user/"
        uploadUrl="/user/upload_file"
        deleteUrl="/user/delete_document"
        downloadUrl="/user/download_document"
        open={openDocumentDialog}
        handleClose={() => setOpenDocumentDialog(false)}
      />
    </DashboardLayout>
  );
}

export default ElasticBoard;
