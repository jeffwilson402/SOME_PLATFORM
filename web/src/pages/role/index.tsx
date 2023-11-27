import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import DataTable from "../DataTable";
import { useBackdrop } from "context/backdrop";
import MDButton from "components/MDButton";
import NewDialog from "../skill/NewDialog";
import { ISkill } from "interfaces";
import axios from "utils/axios";
import { toast } from "react-toastify";
import RoleCatalog from "./RoleCatalog";

function Role(): JSX.Element {
  const { fetching } = useBackdrop();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const handleSetTabValue = (event: any, newValue: any) => setTabValue(newValue);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  //Accidentally ISkill matches Role Category!
  const [editingCategory, setEditingCategory] = useState<ISkill>(undefined);
  const [catalogs, setCatalogs] = useState([]);
  const [activeRoles, setActiveRoles] = useState([]);

  const handleOpenCategoryDialog = () => {
    setOpenCategoryDialog(true);
  };

  const handleCategoryChange = (value: string, field: string) => {
    setEditingCategory({
      ...editingCategory,
      [field]: value,
    });
  };

  const saveCategory = async () => {
    try {
      console.log(editingCategory);
      await axios.post("/role/category/save", editingCategory);
      getRoleCatalogs();
      toast.success("Created A Category Successfully!");
    } catch (error: any) {
      toast.warn(error.message);
    }
  };

  const getRoleCatalogs = async () => {
    try {
      fetching(true);
      const { data } = await axios.post("/role/category/all", { role: true });
      setCatalogs(data);
    } catch (error) {
    } finally {
      fetching(false);
    }
  };
  const handleSearch = (e: any) => {
    console.log(e.key);
    if (e.key === "Enter") {
      getActiveRoles();
    }
  };
  const getActiveRoles = async () => {
    try {
      fetching(true);
      const { data } = await axios.post("/role/active", { searchKey, perPage, currentPage });
      setActiveRoles(data.data);
      setCount(data.count);
    } catch (error) {
    } finally {
      fetching(false);
    }
  };

  const showActiveRoles = useMemo(() => {
    const data = activeRoles.map((role: any) => ({
      name: role.name,
      actions: (
        <>
          <MDButton
            iconOnly
            color="info"
            style={{ marginRight: 3 }}
            onClick={() => navigate(`/roles/edit/${role._id}`)}
          >
            <Icon>edit</Icon>
          </MDButton>
          <MDButton iconOnly color="primary">
            <Icon>delete</Icon>
          </MDButton>
        </>
      ),
    }));
    return data;
  }, [activeRoles]);

  useEffect(() => {
    if (tabValue === 0) getActiveRoles();
    else getRoleCatalogs();
  }, [tabValue]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={3}>
        <AppBar position="static">
          <Tabs orientation="horizontal" value={tabValue} onChange={handleSetTabValue}>
            <Tab
              label="Active Roles"
              icon={
                <Icon fontSize="small" sx={{ mt: -0.25 }}>
                  group
                </Icon>
              }
            />
            <Tab
              label="Role Catalog"
              icon={
                <Icon fontSize="small" sx={{ mt: -0.25 }}>
                  contact_page
                </Icon>
              }
            />
          </Tabs>
        </AppBar>
        <Grid item xs={12} mt={1}>
          {tabValue === 0 && (
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
                  { Header: "Role", accessor: "name" },
                  { Header: "Actions", accessor: "actions", width: "30%" },
                ],
                rows: showActiveRoles,
              }}
            />
          )}
          {tabValue == 1 && <RoleCatalog catalogs={catalogs} getActiveRoles={getActiveRoles} />}
        </Grid>
        <NewDialog
          title="New Category"
          skill={editingCategory}
          open={openCategoryDialog}
          handleClose={() => setOpenCategoryDialog(false)}
          handleChange={handleCategoryChange}
          save={saveCategory}
        />
      </MDBox>
    </DashboardLayout>
  );
}

export default Role;
