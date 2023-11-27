import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import DataTable from "../DataTable";
import { useBackdrop } from "context/backdrop";
import NewDialog from "./NewDialog";
import { toast } from "react-toastify";
import { ISkill } from "interfaces";
import axios from "utils/axios";
import MDInput from "components/MDInput";
import { dialogRender } from "utils/confirmDialog";
import { confirm } from "react-confirm-box";

function Skill(): JSX.Element {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSkill, setEditingSkill] = useState<ISkill>(undefined);
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<ISkill[]>();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const { fetching } = useBackdrop();
  const [search, setSearch] = useState("");
  const handleOpenNew = () => {
    setOpenDialog(true);
    setEditingSkill(undefined);
  };
  const handleSkillChange = (value: string, field: string) => {
    setEditingSkill({
      ...editingSkill,
      [field]: value,
    });
  };

  const saveSkill = async () => {
    try {
      if (!editingSkill || !editingSkill.name) {
        toast.warn("Please Input Skill Name!");
        return;
      }
      setSaving(true);
      await axios.post("/skill/save", editingSkill);
      toast.success("Saved a Skill Successfully!");
      setOpenDialog(false);
      setSearch("");
      getAllSkills();
    } catch (error: any) {
      toast.warn(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = (e: any) => {
    if (e.key === "Enter") {
      setCurrentPage(0);
      getAllSkills();
    }
  };

  const handleSearchChange = (e: any) => {
    let temp = skills;
    setSearch(e.target.value);
    temp = temp.filter(
      (t: ISkill) => t.name.includes(e.target.value) || t.description.includes(e.target.value)
    );
    setFilteredSkills(temp);
  };

  const handleEdit = (skill: ISkill) => {
    setEditingSkill(skill);
    setOpenDialog(true);
  };

  const handleDelete = async (skill: ISkill, options: any) => {
    const result = await confirm("Are you sure to delete this skill?", options);
    try {
      if (result) {
        await axios.delete(`/skill/delete/${skill._id}`);
        toast.success("Deleted Skill Successfully!");
        getAllSkills();
      }
    } catch (error: any) {
      toast.warn(error.message);
    }
  };

  const getAllSkills = async () => {
    try {
      fetching(true);
      const { data } = await axios.post("/skill/all", { searchKey, currentPage, perPage });
      setCount(data.count);
      const temp = data.data.map((p: ISkill) => ({
        name: p.name,
        description: p.description,
        actions: (
          <MDBox display="flex" justifyContent="space-between">
            <MDButton
              color="info"
              style={{ marginRight: 3 }}
              iconOnly
              onClick={() => handleEdit(p)}
            >
              <Icon>edit</Icon>
            </MDButton>
            <MDButton color="primary" iconOnly onClick={() => handleDelete(p, dialogRender)}>
              <Icon>delete</Icon>
            </MDButton>
          </MDBox>
        ),
      }));
      setSkills(temp);
      setFilteredSkills(temp);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      fetching(false);
    }
  };

  useEffect(() => {
    getAllSkills();
  }, [perPage, currentPage]);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <MDBox display="flex" justifyContent="space-between">
          {/* <MDInput
            label="Search..."
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
          /> */}
          <MDButton variant="gradient" color="info" onClick={handleOpenNew}>
            <Icon>add</Icon>&nbsp; New Skill
          </MDButton>
        </MDBox>
        <Grid item xs={12} mt={3}>
          <DataTable
            canSearch
            currentPage={currentPage}
            totalCount={count}
            perPage={perPage}
            handleSearch={handleSearch}
            setSearchKey={setSearchKey}
            setPerPage={setPerPage}
            setCurrentPage={setCurrentPage}
            table={{
              columns: [
                { Header: "Skill", accessor: "name" },
                { Header: "Description", accessor: "description", width: "40%" },
                { Header: "Actions", accessor: "actions", width: "30%" },
              ],
              rows: skills || [],
            }}
          />
        </Grid>
      </MDBox>
      <NewDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        skill={editingSkill}
        handleChange={handleSkillChange}
        save={saveSkill}
      />
    </DashboardLayout>
  );
}

export default Skill;
