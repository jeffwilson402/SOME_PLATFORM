import { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { authContext } from "context/auth";
import { permissionRoute } from "context/constants";
import { AppBar, Autocomplete, Icon, Tab, Tabs } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "utils/axios";
import { useBackdrop } from "context/backdrop";
import { UserTypes } from "interfaces/enums";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { toast } from "react-toastify";
import { dialogRender } from "utils/confirmDialog";
import { confirm } from "react-confirm-box";
import EditTeamMember from "./EditTeamMember";
import MDTypography from "components/MDTypography";

function ManageTeam(): JSX.Element {
  const { id } = useParams();
  const { fetching } = useBackdrop();
  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event: any, newValue: any) => {
    setTabValue(newValue);
    setSelectedUser(null);
  };
  const [projectName, setProjectName] = useState("");
  const [elasticMembers, setElasticMembers] = useState([]);
  const [coreMembers, setCoreMembers] = useState([]);
  const [elasticUsers, setElasticUsers] = useState([]);
  const [coreUsers, setCoreUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(undefined);

  const handleOpenEdit = (member: any) => {
    setOpenEdit(true);
    setEditingTeamMember(member);
  };
  const getUserOptions = async () => {
    try {
      const { data } = await axios.post("/user/options");
      setElasticUsers(data.elasticUsers);
      setCoreUsers(data.coreUsers);
    } catch (error) {}
  };
  const getProject = async () => {
    try {
      fetching(true);
      const { data } = await axios.get(`/project/${id}`);
      setProjectName(data.name);
      let elastics: any = [],
        cores: any = [];
      for (let i = 0; i < data.team.length; i++) {
        const object = {
          email: data.team[i].email,
          startDate: data.team[i].startDate?.substring(0, 10),
          endDate: data.team[i].endDate?.substring(0, 10),
          actions: (
            <>
              <MDButton iconOnly color="info" onClick={() => handleOpenEdit(data.team[i])}>
                <Icon>edit</Icon>
              </MDButton>
              <MDButton
                iconOnly
                color="primary"
                onClick={() => deleteMember(data.team[i], dialogRender)}
              >
                <Icon>delete</Icon>
              </MDButton>
            </>
          ),
        };
        if (data.team[i].userType === UserTypes.ENGINEER) elastics.push(object);
        else if (data.team[i].userType === UserTypes.CORE) cores.push(object);
      }
      setElasticMembers(elastics);
      setCoreMembers(cores);
    } catch (error) {
      console.log(error);
    } finally {
      fetching(false);
    }
  };

  const addMember = async () => {
    try {
      fetching(true);
      const { data } = await axios.post("/project/add_member", {
        user_id: selectedUser._id,
        project_id: id,
      });
      const toAdd = {
        email: data.email,
        startDate: "",
        endDate: "",
        actions: (
          <>
            <MDButton iconOnly color="info">
              <Icon>save</Icon>
            </MDButton>
            <MDButton iconOnly color="primary">
              <Icon>delete</Icon>
            </MDButton>
          </>
        ),
      };
      if (data.userType === UserTypes.ENGINEER) setElasticMembers((prev) => [...prev, toAdd]);
      else setCoreMembers((prev) => [...prev, toAdd]);
    } catch (error: any) {
      toast.warn(error.response.data.message);
    } finally {
      fetching(false);
    }
  };
  const deleteMember = async (user: any, options: any) => {
    const result = await confirm("Are you sure to delete this Member?", options);
    if (result) {
      try {
        fetching(true);
        await axios.post(`/project/delete_team_member`, { user_id: user.userID, project_id: id });
        toast.success("The Team Member has been deleted successfully!");
        getProject();
      } catch (error) {
      } finally {
        fetching(false);
      }
    }
  };

  const saveMember = async (startDate: any, endDate: any) => {
    try {
      await axios.post("/project/save_team_member", {
        project_id: id,
        user_id: editingTeamMember.userID,
        startDate,
        endDate,
      });
      toast.success("A Team Member has been edited successfully");
    } catch (error) {}
  };

  useEffect(() => {
    getProject();
    getUserOptions();
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <MDTypography>{projectName}</MDTypography>
        <AppBar position="static">
          <Tabs orientation="horizontal" value={tabValue} onChange={handleSetTabValue}>
            <Tab
              label="Elastic Members"
              icon={
                <Icon fontSize="small" sx={{ mt: -0.25 }}>
                  group
                </Icon>
              }
            />
            <Tab
              label="Core Team Members"
              icon={
                <Icon fontSize="small" sx={{ mt: -0.25 }}>
                  contact_page
                </Icon>
              }
            />
          </Tabs>
        </AppBar>
      </MDBox>
      <MDBox display="flex" mb={3} alignItems="center">
        <Autocomplete
          fullWidth
          options={tabValue === 0 ? elasticUsers : coreUsers}
          getOptionLabel={(option) => option.email || ""}
          isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
          value={selectedUser || null}
          onChange={(e: any, value) => setSelectedUser(value)}
          renderInput={(params) => (
            <MDInput
              {...params}
              label="Choose Users For This Project"
              variant="standard"
              size="medium"
            />
          )}
        />
        <MDBox ml={3}>
          <MDButton iconOnly color="info" onClick={addMember}>
            <Icon>add</Icon>
          </MDButton>
        </MDBox>
      </MDBox>

      <MDBox>
        <DataTable
          canSearch
          table={{
            columns: [
              { Header: "Email", accessor: "email" },
              { Header: "Start Date", accessor: "startDate" },
              { Header: "End Date", accessor: "endDate" },
              { Header: "Actions", accessor: "actions", width: "10%" },
            ],
            rows: tabValue === 0 ? elasticMembers : coreMembers,
          }}
        />
      </MDBox>
      <EditTeamMember
        teamMember={editingTeamMember}
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
        save={saveMember}
      />
    </DashboardLayout>
  );
}

export default ManageTeam;
