// @mui material components
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Project from "./ProjectDetail";

import axios from "utils/axios";
import { useBackdrop } from "context/backdrop";

function ProjectDetail({ formData }: any): JSX.Element {
  const { fetching } = useBackdrop();

  const [projectOptions, setProjectOptions] = useState([]);

  const getProjects = async () => {
    try {
      fetching(true);
      const { data } = await axios.post("/project/all", { fields: ["_id", "name"] });
      setProjectOptions(data);
    } catch (error) {
    } finally {
      fetching(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);
  return (
    <MDBox>
      <MDTypography p={3} variant="h5" fontWeight="bold">
        Projects
      </MDTypography>
      <MDBox mt={1.625}>
        <Project formData={formData} projectOptions={projectOptions} />
      </MDBox>
    </MDBox>
  );
}

export default ProjectDetail;
