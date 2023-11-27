import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import AnalyticsCard from "./AnalyticsCard";
import ProjectsIcon from "assets/images/svg/engineer/projects.svg";
import RolesIcon from "assets/images/svg/roles.svg";
import SkillsIcon from "assets/images/svg/skills.svg";
import GoalsIcon from "assets/images/svg/engineer/goals.svg";
import AnalysisIcon from "assets/images/svg/analysis.svg";
import TotalSkillsIcon from "assets/images/svg/engineer/total_skill.svg";
import ExternalRegistrantsIcon from "assets/images/svg/engineer/total_skill.svg";
import { Divider } from "@mui/material";
import axios from "utils/axios";
import { useBackdrop } from "context/backdrop";

const analysis_list = [
  {
    image: TotalSkillsIcon,
    color: "info",
    title: "#TOTAL SKILLED ENGINEERS",
    description: "View Engineers and their skills",
    url: "total_skilled_engineers",
  },
  {
    image: RolesIcon,
    color: "dark",
    title: "#Assigned Roles",
    description: "View Roles Histogram",
    url: "assigned_roles",
  },
  {
    image: SkillsIcon,
    color: "light",
    title: "# CLAIMED SKILLS",
    description: "View Skills Histogram",
    url: "claimed_skills",
  },
  {
    image: GoalsIcon,
    color: "success",
    title: "# GOALS ACCOMPLISHED",
    description: "View Goal Progress",
    url: "goals_accomplished",
  },
  {
    image: ProjectsIcon,
    color: "warning",
    title: "# PROJECT ASSIGNMENTS",
    description: "View Projects Histogram",
    url: "project_assignments",
  },
  // {
  //   image: AnalysisIcon,
  //   color: "error",
  //   title: "# LEARNING ACTIVITIES",
  //   description: "View Learning Histogram",
  //   url: "learning_activities",
  // },
];

function Analysis(): JSX.Element {
  const [info, setInfo] = useState<any>({});
  const { fetching } = useBackdrop();
  const getInfo = async () => {
    try {
      fetching(true);
      const { data } = await axios.get("/analysis/info");
      setInfo(data);
    } catch (error) {
    } finally {
      fetching(false);
    }
  };
  useEffect(() => {
    getInfo();
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <Grid container spacing={3}>
          {analysis_list.map((analysis: any, i: number) => (
            <Grid item key={i} xs={12} sm={6}>
              <AnalyticsCard
                image={analysis.image}
                color={analysis.color}
                title={analysis.title}
                url={analysis.url}
                name={info[analysis.url] || 0}
                description={analysis.description}
              />
            </Grid>
          ))}
          <Divider />
          <Grid item xs={12} sm={6}>
            <AnalyticsCard
              image={ExternalRegistrantsIcon}
              color="secondary"
              title="# EXTERNAL REGISTRANTS"
              name={info["external_registrants"]}
              url="external_registrants"
              description="View Registrants Details"
            />
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Analysis;
