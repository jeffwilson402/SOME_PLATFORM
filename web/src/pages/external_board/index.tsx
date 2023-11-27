import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Chip, Grid, Icon, Tooltip } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CustomCollapse from "pages/role/RoleCatalog/Collapse";
import DataTable from "examples/Tables/DataTable";

import axios from "utils/axios";
import { ExternalUser, ExternalUserSkill, ExternalUserRole } from "./types";

function ExternalTalentBoard(): JSX.Element {
  const availableColumns: Record<string, string> = {
    "Full Name": "name",
    "Available on": "availablity",
    "Application date": "createdAt",
    "Claimed Roles": "roles",
    "Claimed Skills": "skills",
  };
  const mapData = (user: ExternalUser) => ({
    _id: user._id,
    name: `${user.firstName} ${user.lastName}`,
    createdAt: new Date(Date.parse(user.createdAt)).toDateString(),
    availablity: new Date(Date.parse(user.availablity)).toDateString(),
    skills: renderSkillsChips(user.skills),
    roles: renderRoles(user.roles),
  });

  const navigate = useNavigate();
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [externalTalent, setExternalTalent] = useState([]);
  const [totalTalentPool, setTotalTalentPool] = useState(0);
  const [sort, setSort] = useState({
    column: "",
    ascending: true,
  });
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
  });
  const [filters, setFilters] = useState<Record<string, string>>({
    name: "",
    email: "",
    location: "",
    skills: "",
    roles: "",
    availablityAfter: "1999-01-01",
    availablityBefore: "2999-01-01",
  });

  useEffect(() => {
    const fetchData = async () => {
      const urlSearchParams = new URLSearchParams();
      // pagination
      urlSearchParams.set("limit", `${pagination.limit}`);
      urlSearchParams.set("page", `${pagination.page}`);

      // sort
      if (sort.column !== "") {
        const order = sort.ascending ? "+" : "-";
        urlSearchParams.set("sort", `${order}${sort.column}`);
      }

      //filter
      for (const filterKey of Object.keys(filters)) {
        const filter = filters[filterKey];
        if (filter !== "") {
          urlSearchParams.set(filterKey, filter);
        }
      }

      const { data } = await axios.get<{ users: ExternalUser[]; total: number }>(
        `/user/external_user/get?${urlSearchParams.toString()}`
      );

      setExternalTalent(data.users);
      setTotalTalentPool(data.total);
    };
    fetchData().catch(console.error);
  }, [filters, pagination, sort]);

  const renderSkillsChips = (skills: ExternalUserSkill[]) => {
    const sortedSkills = skills.sort((a, b) => {
      return b.level - a.level;
    });
    return (
      <Grid container spacing={2}>
        {sortedSkills
          .map((skill, index) => {
            return (
              <Grid item key={index}>
                <Chip label={skill.name} />
              </Grid>
            );
          })
          .filter((_, index) => index < 2)}

        {skills.length > 2 && (
          <Grid item>
            <Tooltip title={sortedSkills.map((skill) => skill.name).join(", ")}>
              <Chip label={`+${skills.length - 2}`} />
            </Tooltip>
          </Grid>
        )}
      </Grid>
    );
  };

  const renderRoles = (roles: ExternalUserRole[]) => {
    const sortedRoles = roles.sort((a, b) => {
      return Date.parse(b.endDate) - Date.parse(a.endDate);
    });
    return (
      <Grid container spacing={2}>
        {sortedRoles
          .map((role, index) => {
            return (
              <Grid item key={index}>
                <Chip label={role.name} />
              </Grid>
            );
          })
          .filter((_, index) => index < 1)}

        {sortedRoles.length > 1 && (
          <Grid item>
            <Tooltip title={sortedRoles.map((role) => role.name).join(", ")}>
              <Chip label={`+${roles.length - 1}`} />
            </Tooltip>
          </Grid>
        )}
      </Grid>
    );
  };

  const renderTotalTalentPool = (
    <Grid container p={2}>
      <Grid item>
        <h4
          style={{
            color: "#032679",
          }}
        >
          Total New Applicants: {totalTalentPool}
        </h4>
      </Grid>
    </Grid>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <Grid container>
          <Grid item xs={12}>
            <CustomCollapse
              title="Filter"
              open={isFilterOpen}
              onClick={() => setFilterOpen((open) => !open)}
            >
              <Card>
                <MDBox p={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <MDInput
                        type="text"
                        label="Search By Name"
                        fullWidth
                        value={filters.name}
                        variant="standard"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFilters({
                            ...filters,
                            name: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDInput
                        type="text"
                        label="Search By Email"
                        fullWidth
                        value={filters.email}
                        variant="standard"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFilters({
                            ...filters,
                            email: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDInput
                        type="text"
                        label="Search By Location"
                        fullWidth
                        value={filters.location}
                        variant="standard"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFilters({
                            ...filters,
                            location: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDInput
                        type="text"
                        label="Search By Skills"
                        fullWidth
                        value={filters.skills}
                        variant="standard"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFilters({
                            ...filters,
                            skills: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDInput
                        type="text"
                        label="Search By Roles"
                        fullWidth
                        value={filters.roles}
                        variant="standard"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFilters({
                            ...filters,
                            roles: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <MDInput
                        type="date"
                        label="Available From"
                        fullWidth
                        value={filters.availablityAfter}
                        variant="standard"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFilters({
                            ...filters,
                            availablityAfter: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <MDInput
                        type="date"
                        label="Available To"
                        fullWidth
                        value={filters.availablityBefore}
                        variant="standard"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFilters({
                            ...filters,
                            availablityBefore: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>
            </CustomCollapse>
          </Grid>
          <Grid item xs={12} p={2}>
            <Grid container spacing={2}>
              <DataTable
                table={{
                  columns: Object.keys(availableColumns).map((key) => ({
                    Header: key,
                    accessor: availableColumns[key],
                  })),
                  rows: externalTalent.map(mapData),
                }}
                header={renderTotalTalentPool}
                onRowClick={(data: ExternalUser) => {
                  navigate(`/external_talent_board/${data._id}/view`);
                }}
                onPageChange={(page) => {
                  setPagination({
                    ...pagination,
                    page,
                  });
                }}
                onPageSizeChange={(limit) => {
                  setPagination({
                    ...pagination,
                    limit,
                  });
                }}
                onSort={(column) => {
                  if (column.isSorted) {
                    setSort({
                      column: column.Header,
                      ascending: !column.isSortedDesc,
                    });
                  } else if (sort.column === column.Header) {
                    setSort({
                      column: "",
                      ascending: true,
                    });
                  }
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ExternalTalentBoard;
