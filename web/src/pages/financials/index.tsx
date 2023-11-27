import { useContext, useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "../DataTable";
import axios from "utils/axios";
import { useBackdrop } from "context/backdrop";

function Financials(): JSX.Element {
  const [financials, setFinancials] = useState([]);
  const { fetching } = useBackdrop();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const getData = async () => {
    try {
      fetching(true);
      const {
        data: { data, count },
      } = await axios.post("/user/financials", { searchKey, currentPage, perPage });

      setFinancials(data);
      setCount(count);
    } catch (error) {
    } finally {
      fetching(false);
    }
  };
  const handleSearch = (e:any)=> {
    console.log(e.key)
    if(e.key === "Enter"){
      getData();
    }
  }
  useEffect(() => {
    getData();
  }, [perPage, currentPage]);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3} p={3}>
        <Grid container spacing={3}>
          <DataTable
            canSearch
            currentPage={currentPage}
            totalCount={count}
            perPage={perPage}
            handleSearch={handleSearch}
            setSearchKey={setSearchKey}
            setPerPage={setPerPage}
            setCurrentPage={setCurrentPage}
            showTotalEntries
            table={{
              columns: [
                { Header: "Member", accessor: "email" },
                { Header: "Rate", accessor: "payment.amount" },
                { Header: "Per", accessor: "payment.frequency" },
                { Header: "Currency", accessor: "payment.currency" },
                { Header: "Agency", accessor: "payment.paymentVia" },
                { Header: "Project", accessor: "project_desc" },
              ],
              rows: financials,
            }}
          />
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Financials;
