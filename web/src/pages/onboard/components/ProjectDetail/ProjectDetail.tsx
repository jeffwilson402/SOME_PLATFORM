import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import FormSelect from "../FormSelect";
import axios from "utils/axios";
import FormField from "../FormField";
import { ProjectTypes, PropositionTypes } from "interfaces/enums";
import initialValues, {
  FormValueType,
  ProjectDetailType,
} from "pages/onboard/schemas/initialValues";
import MDButton from "components/MDButton";
import { FormType } from "pages/onboard/schemas/form";
import { FormikProps } from "formik";
import { Button, Icon } from "@mui/material";

export type ProjectProps = {
  formData: FormikProps<FormValueType> & {
    formField: FormType;
    readonly: boolean;
  };
  projectOptions: {
    _id: string;
    name: string;
  }[];
};

function Project({ formData, projectOptions }: ProjectProps): JSX.Element {
  const { formField, values, errors, touched, setFieldValue, readonly } = formData;
  const { projectDetail } = formField;
  const { projectDetail: projectDetailVUnsorted } = values;
  const [clientsList, updateClientsList] = useState([]);
  const [expanded, setExpanded] = useState(false);

  let projectDetailV = (projectDetailVUnsorted as Array<ProjectDetailType>).sort(
    (a: ProjectDetailType, b: ProjectDetailType) => {
      return (
        (Date.parse(b.projectEnd) - Date.parse(a.projectEnd)) * 2 +
        (Date.parse(b.projectStart) - Date.parse(a.projectStart))
      );
    }
  );
  if (!expanded && projectDetailV.length >= 1) {
    projectDetailV = [projectDetailV[0]];
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/clients/all");
      updateClientsList(data.map((client: any) => client.name));
    };
    fetchData().catch(console.log);
  }, []);

  const addProject = () => {
    setFieldValue(projectDetail.name, [
      ...projectDetailV,
      (initialValues[projectDetail.name] as Array<ProjectDetailType>)[0],
    ]);
  };
  const removeProject = () => {
    projectDetailV.pop();
    setFieldValue(projectDetail.name, projectDetailV);
  };
  useEffect(() => {
    if (projectDetailV.length === 0)
      setFieldValue(projectDetail.name, initialValues[projectDetail.name]);
  }, [projectDetailV]);

  const getProjectBackgroundColor = (index: number) => {
    if (index % 2 === 0) {
      return "auto";
    }
    return "#f0f2f5";
  };
  const getCompletedProjects = () => {
    return projectDetailV
      .filter((project: any) => Date.parse(project.projectEnd) <= Date.now())
      .length.toString();
  };
  const getAggregatedTenure = () => {
    const oneDay = 24 * 60 * 60 * 1000;
    let totalDays = 0;
    for (let i = 0; i < projectDetailV.length; i++) {
      const project = projectDetailV[i];
      const startDate = Date.parse(project.projectStart);
      const endDate = Math.min(Date.parse(project.projectEnd), Date.now());
      totalDays += Math.floor((endDate - startDate) / oneDay);
    }
    return totalDays;
  };

  return (
    <MDBox>
      <Grid container spacing={1}>
        <Grid
          container
          paddingLeft={4}
          paddingRight={4}
          paddingTop={2}
          marginBottom={2}
          style={{
            backgroundColor: "#f0f2f5",
          }}
        >
          <Grid item xs={12} sm={6}>
            <FormField
              disabled={true}
              type="text"
              name="generated"
              label="Total Projects Completed"
              value={getCompletedProjects()}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              disabled={true}
              type="text"
              name="generated"
              label="Aggregated Tenure (total days worked on all projects)"
              value={getAggregatedTenure()}
            />
          </Grid>
        </Grid>
        {projectDetailV.map((detail: any, index: number) => (
          <Grid
            container
            marginLeft={1}
            paddingLeft={2}
            paddingRight={3}
            paddingTop={1}
            paddingBottom={1}
            marginBottom={2}
            spacing={1}
            key={index}
            style={{
              backgroundColor: getProjectBackgroundColor(index),
            }}
          >
            <Grid item xs={12} sm={6}>
              <FormSelect
                disabled={readonly}
                setFieldValue={setFieldValue}
                value={{
                  ...detail.projectId,
                }}
                isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
                getOptionLabel={(option: any) => option.name}
                name={`${projectDetail.name}.${index}.projectId`}
                label={projectDetail.projectId.label}
                options={projectOptions}
              />
            </Grid>
            {detail.projectId && detail._id && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormSelect
                    disabled={readonly}
                    setFieldValue={setFieldValue}
                    value={detail.projectClient}
                    name={projectDetail.projectClient.name}
                    label={projectDetail.projectClient.label}
                    options={clientsList}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    disabled={readonly}
                    type={projectDetail.projectStart.type}
                    label={projectDetail.projectStart.label}
                    name={`${projectDetail.name}.${index}.${projectDetail.projectStart.name}`}
                    value={detail.projectStart}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    disabled={readonly}
                    type={projectDetail.projectEnd.type}
                    label={projectDetail.projectEnd.label}
                    name={`${projectDetail.name}.${index}.${projectDetail.projectEnd.name}`}
                    value={detail.projectEnd}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormSelect
                    disabled={readonly}
                    setFieldValue={setFieldValue}
                    value={detail.projectType}
                    name={`${projectDetail.name}.${index}.${projectDetail.projectType.name}`}
                    label={projectDetail.projectType.label}
                    options={[ProjectTypes.ONBOARD, ProjectTypes.REMOTE]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormSelect
                    disabled={readonly}
                    setFieldValue={setFieldValue}
                    value={detail.proposition}
                    name={projectDetail.proposition.name}
                    label={projectDetail.proposition.label}
                    options={Object.values(PropositionTypes)}
                  />
                </Grid>
              </>
            )}
          </Grid>
        ))}
      </Grid>
      {!readonly && (
        <MDBox
          p={3}
          display="flex"
          justifyContent={projectDetailV.length > 1 ? "space-between" : "end"}
        >
          {expanded && projectDetailV.length > 1 && (
            <MDButton color="primary" size="small" iconOnly onClick={removeProject}>
              <Icon>remove</Icon>
            </MDButton>
          )}
          {expanded && (
            <MDButton color="info" size="small" iconOnly onClick={addProject}>
              <Icon>add</Icon>
            </MDButton>
          )}
        </MDBox>
      )}
      {projectDetailV.length > 1 && (
        <Grid item xs={12} textAlign="center">
          <Button onClick={() => setExpanded(!expanded)}>{expanded ? "Hide" : "Show More"}</Button>
        </Grid>
      )}
    </MDBox>
  );
}

export default Project;
