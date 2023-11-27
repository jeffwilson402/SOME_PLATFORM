import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { IRole } from "interfaces";
import MDInput from "components/MDInput";
import {
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Icon,
  TextField,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";
import axios from "utils/axios";
import { useBackdrop } from "context/backdrop";
import { SkillScopes } from "interfaces/enums";
import { toast } from "react-toastify";

const scopeOptions = [
  SkillScopes.ROLE_SPECIFIC,
  SkillScopes.SECTOR_SPECIFIC,
  SkillScopes.CROSS_SPECIFIC,
  SkillScopes.GLOBAL_SCOPE,
];
function CreateRole(): JSX.Element {
  const { _id } = useParams();
  const navigate = useNavigate();
  const { fetching } = useBackdrop();
  const [role, setRole] = useState<IRole>(undefined);
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [addedSkills, setAddedSkills] = useState([]);

  const handleChange = (value: any, field: string) => {
    setRole({
      ...role,
      [field]: value,
    });
  };

  const getRole = async () => {
    try {
      const { data } = await axios.get(`/role/${_id}`);
      setRole(data);
      setAddedSkills(data.skills);
    } catch (error) {}
  };

  const showSkills = (skills: any) => {
    const data = skills?.map((skill: any) => ({
      skill: skill.name,
      required: (
        <Checkbox
          checked={!skill.optional}
          onChange={(e: any) => handleChangeSkills(skill, !e.target.checked, "optional")}
        />
      ),
      scope: (
        <Autocomplete
          fullWidth
          style={{ width: "200%" }}
          options={scopeOptions}
          value={skill.scope}
          onChange={(e: any, value) => handleChangeSkills(skill, value, "scope")}
          renderInput={(params) => <TextField fullWidth {...params} variant="standard" label="" />}
        />
      ),
      actions: (
        <MDButton iconOnly color="primary" onClick={() => deleteSkill(skill)}>
          <Icon>delete</Icon>
        </MDButton>
      ),
    }));
    return data;
  };

  const handleChangeSkills = (skill: any, value: any, field: string) => {
    const index = addedSkills.findIndex((s) => s.refID === skill.refID);
    const temp = [...addedSkills];
    temp.splice(index, 1, { ...skill, [field]: value });
    setAddedSkills(temp);
  };

  const deleteSkill = (skill: any) => {
    const temp = [...addedSkills];
    const index = temp.findIndex((s) => s.refID === skill.refID);
    temp.splice(index, 1);
    setAddedSkills(temp);
  };

  const addSkill = () => {
    const check = addedSkills.findIndex((s) => s.skill._id === selectedSkill._id);
    if (check > -1) {
      toast.warn("The Skill Already Exists in the list!");
      return;
    }
    const temp = [
      ...addedSkills,
      {
        skill: selectedSkill,
        scope: SkillScopes.ROLE_SPECIFIC,
        required: false,
      },
    ];
    setAddedSkills(temp);
    showSkills(temp);
  };

  const getSkills = async () => {
    try {
      fetching(true);
      const { data } = await axios.post("/skill/all", { fields: ["_id", "name"] });
      setSkills(data.data);
    } catch (error) {
    } finally {
      fetching(false);
    }
  };

  const getCategories = async () => {
    try {
      fetching(true);
      const { data } = await axios.post("/role/category/all");
      setCategories(data);
    } catch (error) {}
  };
  const saveRole = async () => {
    try {
      fetching(true);
      await axios.post("/role/save", { _id, ...role, skills: addedSkills });
      toast.success("Created A Role Successfully!");
    } catch (error: any) {
      toast.warn(error.response.data.message);
    } finally {
      fetching(false);
    }
  };

  useEffect(() => {
    getSkills();
    getCategories();
    if (_id) getRole();
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <Grid container justifyContent="center" alignItems="center" sx={{ height: "100%", mt: 8 }}>
          <Grid item xs={12} lg={10}>
            <Card style={{ height: "100%" }}>
              <CardContent>
                <MDBox mt={2} lineHeight={0} display="flex" justifyContent="space-between">
                  <MDTypography variant="h5">Edit A Role</MDTypography>
                  <MDBox>
                    <MDButton
                      variant="gradient"
                      color="info"
                      style={{ marginRight: 4 }}
                      onClick={saveRole}
                    >
                      Save
                    </MDButton>
                    <MDButton
                      variant="contained"
                      color="secondary"
                      onClick={() => navigate("/roles")}
                    >
                      Back
                    </MDButton>
                  </MDBox>
                </MDBox>
                <MDBox mt={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <MDInput
                        label="Name"
                        variant="standard"
                        fullWidth
                        size="large"
                        value={role?.name || ""}
                        onChange={(e: any) => handleChange(e.target.value, "name")}
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
                      <Autocomplete
                        options={categories}
                        value={role?.category || null}
                        onChange={(e: any, value) => handleChange(value, "category")}
                        isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
                        fullWidth
                        getOptionLabel={(option: any) => option.name}
                        renderInput={(params) => (
                          <TextField {...params} variant="standard" label="Category" />
                        )}
                      />
                    </Grid> */}
                    <Grid item xs={12}>
                      <MDInput
                        label="Description"
                        value={role?.description}
                        multiline
                        rows={5}
                        fullWidth
                        onChange={(e: any) => handleChange(e.target.value, "description")}
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <Autocomplete
                        options={skills}
                        value={selectedSkill}
                        isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
                        onChange={(e: any, value: any) => setSelectedSkill(value)}
                        fullWidth
                        getOptionLabel={(option: any) => option.name}
                        renderInput={(params) => (
                          <TextField {...params} variant="standard" label="Search Skill" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={2} display="flex" justifyContent="right">
                      <MDButton
                        color="info"
                        variant="gradient"
                        style={{ height: "100%" }}
                        onClick={addSkill}
                      >
                        Add
                      </MDButton>
                    </Grid>
                    <Grid item xs={12}>
                      <DataTable
                        table={{
                          columns: [
                            { Header: "Skill", accessor: "skill" },
                            { Header: "Scope", accessor: "scope", width: "40%" },
                            { Header: "Required", accessor: "required", width: "10%" },
                            { Header: "Actions", accessor: "actions", width: "10%" },
                          ],
                          rows: showSkills(addedSkills),
                        }}
                      />
                    </Grid>
                  </Grid>
                </MDBox>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default CreateRole;
