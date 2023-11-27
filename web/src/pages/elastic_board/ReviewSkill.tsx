import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { authContext } from "context/auth";
import { permissionRoute } from "context/constants";
import DataTable from "examples/Tables/DataTable";
import axios from "utils/axios";
import { Autocomplete, Icon } from "@mui/material";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useBackdrop } from "context/backdrop";
import { toast } from "react-toastify";
import MDTypography from "components/MDTypography";

function ReviewSkill(): JSX.Element {
  const { id } = useParams();
  const { fetching } = useBackdrop();
  const { authUser } = useContext(authContext);
  const [skills, setSkills] = useState([]);
  const [email, setEmail] = useState("");

  const getSkills = async () => {
    try {
      fetching(true);
      const { data } = await axios.get(`/user/skills/${id}`);
      setSkills(data.skills);
      setEmail(data.email);
    } catch (error) {
    } finally {
      fetching(false);
    }
  };

  const handleChangeLevel = (i: number, value: string) => {
    const temp = [...skills];
    temp[i].level = value;
    setSkills(temp);
  };

  const saveSkill = async (i: number) => {
    try {
      console.log(skills[i]);
      fetching(true);
      await axios.post("/user/save_skill", {
        skill: { refID: skills[i].refID, level: skills[i].level },
        _id: id,
      });
      toast.success("The skill has been adjusted successfully!");
    } catch (error) {
    } finally {
      fetching(false);
    }
  };

  const skillData = useMemo(() => {
    return skills.map((skill: any, i: number) => ({
      ...skill,
      level: (
        <Autocomplete
          fullWidth
          disableClearable
          options={["1", "2", "3", "4", "5"]}
          value={String(skill.level)}
          onChange={(e: any, value: string) => handleChangeLevel(i, value)}
          renderInput={(params) => <MDInput {...params} variant="standard" size="medium" />}
        />
      ),
      actions: (
        <MDButton iconOnly variant="contained" color="info" onClick={() => saveSkill(i)}>
          <Icon>save</Icon>
        </MDButton>
      ),
    }));
  }, [skills]);

  useEffect(() => {
    getSkills();
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <MDBox my={2}>
          <MDTypography variant="h6">Skills For {email}</MDTypography>
        </MDBox>
        <DataTable
          canSearch
          table={{
            columns: [
              { Header: "Name", accessor: "name" },
              { Header: "Level", accessor: "level" },
              { Header: "Approved By", accessor: "approvedBy.email" },
              { Header: "Actions", accessor: "actions" },
            ],
            rows: skillData,
          }}
        />
      </MDBox>
    </DashboardLayout>
  );
}

export default ReviewSkill;
