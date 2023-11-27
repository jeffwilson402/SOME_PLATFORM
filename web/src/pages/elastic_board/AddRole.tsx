import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import { authContext } from "context/auth";
import { permissionRoute } from "context/constants";
import { Autocomplete, Grid, Icon } from "@mui/material";
import { toast } from "react-toastify";
import { useBackdrop } from "context/backdrop";
import axios from "utils/axios";
import MDInput from "components/MDInput";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import { dialogRender } from "utils/confirmDialog";
import { confirm } from "react-confirm-box";
import MDTypography from "components/MDTypography";

function AddRole(): JSX.Element {
  const { id: user_id } = useParams();
  const { authUser } = useContext(authContext);
  const { fetching } = useBackdrop();
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRole, setSelectedRole] = useState<any>(undefined);
  const [userRoles, setUserRoles] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [email, setEmail] = useState("");

  const getRoles = async () => {
    try {
      const { data } = await axios.post("/role/active", { perPage: 0 });
      setRoleOptions(data);
      setSelectedRole(data[0]);
    } catch (error) {}
  };

  const getUserRoles = async () => {
    try {
      fetching(true);
      const { data } = await axios.get(`/user/roles/${user_id}`);
      setUserRoles(data.roles);
      setEmail(data.email);
    } catch (error) {
    } finally {
      fetching(false);
    }
  };

  const addRole = async (options: any) => {
    try {
      const result = await confirm("Are you sure to add this role?", options);
      if (result) {
        fetching(true);
        const { data } = await axios.post("/user/roles/add", {
          _id: user_id,
          role: selectedRole,
          startDate,
          endDate,
        });
        setUserRoles(data);
      }
    } catch (error: any) {
      toast.warn(error.response.data.message);
    } finally {
      fetching(false);
    }
  };

  const roleData = useMemo(() => {
    return userRoles.map((role: any) => ({
      ...role,
      startDate: role.startDate && role.startDate.substring(0, 10),
      endDate: role.endDate && role.endDate.substring(0, 10),
    }));
  }, [userRoles]);

  useEffect(() => {
    getRoles();
    getUserRoles();
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <MDBox mb={2} display="flex" justifyContent="space-between">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disableClearable
                fullWidth
                options={roleOptions}
                getOptionLabel={(option) => option.name || ""}
                isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
                value={selectedRole || null}
                onChange={(e: any, value) => setSelectedRole(value)}
                renderInput={(params) => (
                  <MDInput
                    {...params}
                    label="Choose A Role For Skills"
                    variant="standard"
                    size="medium"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <MDInput
                fullWidth
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e: any) => setStartDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <MDInput
                type="date"
                fullWidth
                label="End Date"
                value={endDate}
                onChange={(e: any) => setEndDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2} textAlign="right">
              <MDButton variant="contained" color="info" onClick={() => addRole(dialogRender)}>
                <Icon>add</Icon>&nbsp;Add
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={1}>
          <MDTypography variant="caption">
            Note: If you add the selected role to the user, all skills for the role will be added as
            user goals. They can self-assess and a member of the Core team can verify or adjust.
          </MDTypography>
        </MDBox>
        <MDBox mb={1}>
          <MDTypography variant="h6">Roles For {email}</MDTypography>
        </MDBox>
        <DataTable
          canSearch
          table={{
            columns: [
              { Header: "Name", accessor: "name" },
              { Header: "Start Date", accessor: "startDate" },
              { Header: "End Date", accessor: "endDate" },
              { Header: "Actions", accessor: "actions" },
            ],
            rows: roleData || [],
          }}
        />
      </MDBox>
    </DashboardLayout>
  );
}

export default AddRole;
