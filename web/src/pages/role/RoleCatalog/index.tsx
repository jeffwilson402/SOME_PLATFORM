import { useState } from "react";
import { useNavigate } from "react-router-dom";
// @mui material components
import Grid from "@mui/material/Grid";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Pricing page components
import FaqCollapse from "./Collapse";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import { Icon } from "@mui/material";
import MoveToActive from "./MoveToActive";
import axios from "utils/axios";
import { toast } from "react-toastify";

function RoleCatalog({ catalogs, getActiveRoles }: any): JSX.Element {
  const [collapse, setCollapse] = useState<number | boolean>(false);
  const navigate = useNavigate();
  const [openMove, setOpenMove] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const moveToActive = async (name: string) => {
    try {
      await axios.post("/role/activate", { name, role: currentRole });
      getActiveRoles();
      setOpenMove(false);
      toast.success("Activated A Role Successfully!");
    } catch (error: any) {
      toast.warn(error.reponse.data.message);
    }
  };

  const handleMoveToActive = (role: any) => {
    setCurrentRole(role);
    setOpenMove(true);
  };
  const getRolesForCatalog = (catalog: any) => {
    const data = catalog?.roles.map((role: any) => ({
      name: role.name,
      actions: (
        <>
          <MDButton
            iconOnly
            color="success"
            style={{ marginRight: 3 }}
            onClick={() => handleMoveToActive(role)}
          >
            <Icon>keyboard_double_arrow_left</Icon>
          </MDButton>
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
  };
  return (
    <MDBox mt={8} mb={6}>
      <Grid container justifyContent="center">
        {catalogs.map((catalog: any, i: number) => (
          <Grid item xs={12} key={catalog._id}>
            <FaqCollapse
              title={catalog.name}
              open={collapse === i}
              onClick={() => (collapse === i ? setCollapse(false) : setCollapse(i))}
            >
              {catalog?.roles?.length ? (
                <DataTable
                  canSearch
                  table={{
                    columns: [
                      { Header: "Role", accessor: "name" },
                      { Header: "Actions", accessor: "actions", width: "30%" },
                    ],
                    rows: getRolesForCatalog(catalog),
                  }}
                />
              ) : (
                "No Roles For this Category"
              )}
            </FaqCollapse>
          </Grid>
        ))}
      </Grid>
      <MoveToActive
        roleName={currentRole?.name}
        open={openMove}
        handleClose={() => setOpenMove(false)}
        title="Do you want to clone this role into active roles?"
        moveToActiveRole={moveToActive}
      />
    </MDBox>
  );
}

export default RoleCatalog;
