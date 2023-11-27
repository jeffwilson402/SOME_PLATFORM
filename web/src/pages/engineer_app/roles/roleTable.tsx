import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import axios from "utils/axios";
import { useBackdrop } from "context/backdrop";
import MDButton from "components/MDButton";
import { Icon, Tooltip } from "@mui/material";

function ActiveRole(): JSX.Element {
  const navigate = useNavigate();
  const { fetching } = useBackdrop();
  const [activeRoles, setActiveRoles] = useState([]);
  const getActiveRoles = async () => {
    try {
      fetching(true);
      const { data } = await axios.get("/role/active");
      setActiveRoles(data);
    } catch (error) {
    } finally {
      fetching(false);
    }
  };
  const showActiveRoles = (roles: any) => {
    const data = roles.map((role: any) => ({
      name: role.name,
      actions: (
        <>
          <Tooltip title="Add Role To Profile">
            <MDButton
              iconOnly
              color="info"
              style={{ marginRight: 3 }}
            >
              <Icon>group_add</Icon>
            </MDButton>
          </Tooltip>
          <Tooltip title="Add As Goal">
            <MDButton iconOnly color="success">
              <Icon>flag</Icon>
            </MDButton>
          </Tooltip>
        </>
      ),
    }));
    return data;
  };
  const roleTableData = useMemo(() => showActiveRoles(activeRoles), [activeRoles]);

  useEffect(() => {
    getActiveRoles();
  }, []);
  return (
    <>
      <DataTable
        canSearch
        table={{
          columns: [
            { Header: "Role", accessor: "name" },
            { Header: "Actions", accessor: "actions", width: "30%" },
          ],
          rows: roleTableData,
        }}
      />
    </>
  );
}

export default ActiveRole;
