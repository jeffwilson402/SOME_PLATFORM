import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ExampleAvatar from "assets/images/team-2.jpg";
import axios from "utils/axios";
import { useBackdrop } from "context/backdrop";
import PersonCard from "./PersonCard";
import { toast } from "react-toastify";
import Permission from "./Permission";
import MDInput from "components/MDInput";
import { Autocomplete } from "@mui/material";
import MDPagination from "components/MDPagination";
import ManageProject from "./ManageProject";

import { dialogRender } from "utils/confirmDialog";
import { confirm } from "react-confirm-box";

function CoreTeam(): JSX.Element {
  const [members, setMembers] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const closeMenu = () => setOpenMenu(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const pageNum = Math.ceil(count / perPage);
  const handleOpenMenu = (event: any, member: any) => {
    setEditingMember(member);
    setOpenMenu(event.currentTarget);
  };
  const [openPermission, setOpenPermission] = useState(false);
  const [openManageProject, setOpenManageProject] = useState(false);
  const { fetching } = useBackdrop();
  const [editingMember, setEditingMember] = useState(undefined);
  const handleOpenPermission = () => {
    setOpenMenu(false);
    setOpenPermission(true);
  };
  const handleOpenManageProject = () => {
    setOpenMenu(false);
    setOpenManageProject(true);
  };
  const getCoreTeamMembers = async () => {
    try {
      fetching(true);
      const { data } = await axios.post("/user/core/all", { searchKey, perPage, currentPage });
      setMembers(data.data);
      setCount(data.count);
    } catch (error: any) {
      console.log(error);
      toast.warn(error.message);
    } finally {
      fetching(false);
    }
  };
  const handleSearch = (e: any) => {
    if (e.key == "Enter") getCoreTeamMembers();
  };

  const deleteCoreUser = async (options: any) => {
    try {
      setOpenMenu(false);
      const result = await confirm("Are you sure to delete this Core Team Member?", options);
      if (result) {
        await axios.delete(`/user/${editingMember._id}`);
        getCoreTeamMembers();
        toast.success("Deleted A Core Team Member Successfully!");
      }
    } catch (error) {}
  };

  useEffect(() => {
    getCoreTeamMembers();
  }, [perPage, currentPage]);
  const renderMenu = (
    state: any,
    close: any,
    handleOpenPermission: () => void,
    handleOpenManageProject: () => void,
    deleteCoreUser: () => void
  ) => (
    <Menu
      anchorEl={state}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(state)}
      onClose={close}
      keepMounted
    >
      <MenuItem onClick={handleOpenManageProject}>
        <Icon color="info">calendar_month</Icon>
        <MDTypography ml={1} color="info" variant="button">
          Manage Projects
        </MDTypography>
      </MenuItem>
      <MenuItem onClick={handleOpenPermission}>
        <Icon color="success">security</Icon>
        <MDTypography ml={1} color="success" variant="button">
          Edit Permissions
        </MDTypography>
      </MenuItem>
      <MenuItem onClick={deleteCoreUser}>
        <Icon color="error">delete</Icon>
        <MDTypography ml={1} color="error" variant="button">
          Delete Core User
        </MDTypography>
      </MenuItem>
    </Menu>
  );
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <MDInput
            label="Search..."
            variant="outlined"
            value={searchKey}
            onChange={(e: any) => setSearchKey(e.target.value)}
            onKeyPress={handleSearch}
          />
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            {!!currentPage && (
              <MDPagination item onClick={() => setCurrentPage(currentPage - 1)}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
              </MDPagination>
            )}
            <MDBox mx={1}>
              <MDInput
                inputProps={{ type: "number", min: 1, max: pageNum }}
                value={currentPage + 1}
                onChange={(event: any) => {
                  setCurrentPage(Number(event.target.value));
                }}
              />
            </MDBox>
            {currentPage + 1 < pageNum && (
              <MDPagination item onClick={() => setCurrentPage(currentPage + 1)}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
              </MDPagination>
            )}
          </MDBox>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="caption">Per Page:&nbsp;</MDTypography>
            <Autocomplete
              disableClearable
              value={perPage.toString()}
              options={["10", "15", "30"]}
              onChange={(event, newValue) => {
                setPerPage(Number(newValue));
                setCurrentPage(0);
              }}
              size="small"
              sx={{ width: "5rem" }}
              renderInput={(params) => <MDInput {...params} />}
            />
          </MDBox>
        </MDBox>
        <Grid container spacing={3}>
          {members.map((member) => (
            <Grid item sm={12} md={6} lg={4} key={member._id}>
              <PersonCard
                color="light"
                image={member.avatar || ExampleAvatar}
                name={`${member.firstName} ${member.lastName}`}
                dropdown={{
                  action: (e: any) => handleOpenMenu(e, member),
                  menu: renderMenu(
                    openMenu,
                    closeMenu,
                    handleOpenPermission,
                    handleOpenManageProject,
                    () => deleteCoreUser(dialogRender)
                  ),
                }}
                description={member.email}
              />
            </Grid>
          ))}
        </Grid>
        <Permission
          editingMember={editingMember}
          open={openPermission}
          handleClose={() => setOpenPermission(false)}
          save={() => setOpenPermission(false)}
        />
        <ManageProject
          editingMember={editingMember}
          open={openManageProject}
          handleClose={() => setOpenManageProject(false)}
          save={() => setOpenPermission(false)}
        />
      </MDBox>
    </DashboardLayout>
  );
}

export default CoreTeam;
