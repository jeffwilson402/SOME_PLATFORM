import { useEffect, useState, useContext } from "react";
import { Card, Grid } from "@mui/material";
import { authContext } from "context/auth";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import ResponsiveAppBar from "./AppBar";
import LinkCrumbs from "./BreadCrumbs";
import { setLayout, useMaterialUIController } from "context";
import CustomCollapse from "pages/role/RoleCatalog/Collapse";
import ActiveRole from "./roles/roleTable";
import axios from "utils/axios";
function Profile(): JSX.Element {
  const { authUser } = useContext(authContext);
  const [, dispatch] = useMaterialUIController();
  const [openBrowseRoles, setOpenBrowseRoles] = useState(false);
  const [openMyRoles, setOpenMyRoles] = useState(false);
  const [openMySkills, setOpenMySkills] = useState(false);
  const [openBrowseSkills, setOpenBrowseSkills] = useState(false);
  const [openMyGoals, setOpenMyGoals] = useState(false);
  const [profile, setProfile] = useState<any>({});
  const getProfile = async () => {
    try {
      console.log(authUser);
      const { data } = await axios.get(`/user/${authUser._id}`);
      setProfile(data);
    } catch (error) {}
  };
  useEffect(() => {
    setLayout(dispatch, "page");
    if (authUser._id) getProfile();
  }, [authUser]);
  return (
    <>
      <ResponsiveAppBar />
      <LinkCrumbs />
      <MDBox px={2}>
        <Card>
          <MDBox p={3}>
            <MDTypography>My Profile</MDTypography>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} sm={6}>
                <MDInput
                  fullWidth
                  variant="standard"
                  label="First Name"
                  value={profile?.firstName || ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  fullWidth
                  variant="standard"
                  label="Last Name"
                  value={profile?.lastName || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <MDInput multiline fullWidth rows={5} label="Ask Me About" />
              </Grid>
            </Grid>
            <MDTypography>My Roles</MDTypography>
            <CustomCollapse
              title="Browse Roles"
              open={openBrowseRoles}
              onClick={() => setOpenBrowseRoles(!openBrowseRoles)}
            >
              <ActiveRole />
            </CustomCollapse>
            <CustomCollapse
              title="My Roles"
              open={openMyRoles}
              onClick={() => setOpenMyRoles(!openMyRoles)}
            >
              <ActiveRole />
            </CustomCollapse>
            <MDTypography>My Skills</MDTypography>
            <CustomCollapse
              title="My Skills"
              open={openMySkills}
              onClick={() => setOpenMySkills(!openMySkills)}
            >
              <ActiveRole />
            </CustomCollapse>
            <CustomCollapse
              title="Browse Skills"
              open={openBrowseSkills}
              onClick={() => setOpenBrowseSkills(!openBrowseSkills)}
            >
              <ActiveRole />
            </CustomCollapse>
            <MDTypography>My Goals</MDTypography>
            <CustomCollapse
              title="My Goals"
              open={openMyGoals}
              onClick={() => setOpenMyGoals(!openMyGoals)}
            >
              <ActiveRole />
            </CustomCollapse>
          </MDBox>
        </Card>
      </MDBox>
    </>
  );
}

export default Profile;
