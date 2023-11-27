import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import { authContext } from "context/auth";
import { permissionRoute } from "context/constants";
import { Autocomplete, Icon } from "@mui/material";
import axios from "utils/axios";
import MDInput from "components/MDInput";
import { useBackdrop } from "context/backdrop";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import { toast } from "react-toastify";
import MDBadge from "components/MDBadge";
import MDTypography from "components/MDTypography";

function AddSkill(): JSX.Element {
  const { authUser } = useContext(authContext);
  const { id: user_id } = useParams();
  const { fetching } = useBackdrop();
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRole, setSelectedRole] = useState<any>(undefined);
  const [levels, setLevels] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [email, setEmail] = useState("");

  const getRoles = async () => {
    try {
      fetching(true);
      const { data } = await axios.post("/role/active", { perPage: 0 });
      setRoleOptions(data);
      setSelectedRole(data[0]);
      setLevels(Array(data[0]?.skills.length).fill("3"));
    } catch (error) {
    } finally {
      fetching(false);
    }
  };
  const getUserSkills = async () => {
    try {
      const { data } = await axios.get(`/user/skills/${user_id}`);
      setUserSkills(data.skills);
      setEmail(data.email);
    } catch (error) {
    } finally {
    }
  };

  const getSkillLevel = (refID: string) => {
    const found = userSkills.find((skill: any) => skill.refID == refID);
    return found ? found.level : false;
  };

  const handleChangeRole = (value: any) => {
    setSelectedRole(value);
    setLevels(Array(value?.skills.length).fill("3"));
  };
  const handleChangeLevel = (i: number, value: string) => {
    const temp = [...levels];
    console.log(levels, temp[i], i);
    temp[i] = value;
    setLevels(temp);
  };

  const addSkill = async (skill: any, i: number) => {
    try {
      fetching(true);
      console.log(skill.name, levels[i]);
      await axios.post("/user/add_skill", {
        skill,
        level: levels[i],
        _id: user_id,
        approvedBy: authUser._id,
      });
      await getUserSkills();
      toast.success("A Skill has been added to the user successfully!");
    } catch (error) {
    } finally {
      fetching(false);
    }
  };

  const skillData = useMemo(() => {
    return selectedRole?.skills.map((skill: any, i: number) => ({
      ...skill,
      level: (
        <Autocomplete
          fullWidth
          disableClearable
          options={["1", "2", "3", "4", "5"]}
          value={getSkillLevel(skill.refID) || levels[i] || "3"}
          onChange={(e: any, value) => handleChangeLevel(i, value)}
          renderInput={(params) => <MDInput {...params} variant="standard" size="medium" />}
        />
      ),
      status: !!getSkillLevel(skill.refID) && (
        <MDBadge container badgeContent="Added" color="success" />
      ),
      actions: (
        <MDButton
          iconOnly
          variant="contained"
          disabled={!!getSkillLevel(skill.refID)}
          color="info"
          onClick={() => addSkill(skill, i)}
        >
          <Icon>add</Icon>
        </MDButton>
      ),
    }));
  }, [selectedRole, levels, userSkills]);

  useEffect(() => {
    getRoles();
    getUserSkills();
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <MDBox my={2}>
          <MDTypography variant="h6">Skills For {email}</MDTypography>
        </MDBox>
        <MDBox mb={2}>
          <Autocomplete
            fullWidth
            options={roleOptions}
            getOptionLabel={(option) => option.name || ""}
            isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
            value={selectedRole || null}
            onChange={(e: any, value) => handleChangeRole(value)}
            renderInput={(params) => (
              <MDInput
                {...params}
                label="Choose A Role For Skills"
                variant="standard"
                size="medium"
              />
            )}
          />
        </MDBox>
        <DataTable
          canSearch
          table={{
            columns: [
              { Header: "Name", accessor: "name" },
              { Header: "Level", accessor: "level" },
              { Header: "Status", accessor: "status" },
              { Header: "Actions", accessor: "actions" },
            ],
            rows: skillData || [],
          }}
        />
      </MDBox>
    </DashboardLayout>
  );
}

export default AddSkill;
