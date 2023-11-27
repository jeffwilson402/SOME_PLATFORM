// @mui material components
import { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import MDAlert from "components/MDAlert";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FormCheckBox from "../FormCheckBox";

// NewUser page components
import FormField from "../FormField";
import FormSelect from "../FormSelect";
import axios from "utils/axios";
import MDInput from "components/MDInput";
import { Icon, InputAdornment } from "@mui/material";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";

function Others({ formData }: any): JSX.Element {
  const { formField, values, errors, touched, setFieldValue, readonly } = formData;
  const { roles, skills, files } = formField;
  const { roles: roleV, skills: skillsV, files: filesV } = values;
  const fileRef = useRef<HTMLInputElement>(null);
  const [skillOptions, setSkillOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };
  const handleAddFile = () => {
    const timestamp = `${new Date().getTime()}_${file.name}`;
    const newDoc = {
      timestamp,
      file_name: file.name,
      uploadedAt: new Date().toISOString().substring(0, 10),
    };
    console.log([...documents, newDoc]);
    setDocuments([...documents, newDoc]);
    setDocumentFiles([...documentFiles, { timestamp, file }]);
  };

  const handleDocumentDelete = (document: any) => {
    console.log(document.timestamp);
    console.log(documents);
    let temp_documents = [...documents].filter((d: any) => d.timestamp !== document.timestamp);
    console.log(temp_documents);
    setDocuments(temp_documents);
  };
  const getSkillsAndRoles = async () => {
    try {
      const { data } = await axios.post("/skill/all", { fields: ["_id", "name"] });
      setSkillOptions(data.data);
      const res = await axios.post("/role/active_options");
      setRoleOptions(res.data);
    } catch (error) {}
  };
  const convertToDocument = (document: any) => {
    return {
      file_name: document.file_name,
      uploadedAt: document.uploadedAt.substring(0, 10),
      timestamp: document.timestamp,
      actions: (
        <MDBox display="flex" justifyContent="space-between">
          <MDButton disabled={readonly} color="primary" iconOnly onClick={() => handleDocumentDelete(document)}>
            <Icon>delete</Icon>
          </MDButton>
        </MDBox>
      ),
    };
  };
  useEffect(() => {
    getSkillsAndRoles();
  }, []);
  return (
    <MDBox p={3}>
      <MDTypography variant="h5" fontWeight="bold">
        Role & Skills
      </MDTypography>
      <MDBox mt={1.625}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <FormSelect
              disabled={readonly}
              setFieldValue={setFieldValue}
              value={roleV || null}
              name={roles.name}
              label={roles.label}
              options={roleOptions}
              multiple
              getOptionLabel={(option: any) => option.name}
              isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormSelect
              disabled={readonly}
              setFieldValue={setFieldValue}
              isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
              value={skillsV || ""}
              name={skills.name}
              label={skills.label}
              getOptionLabel={(option: any) => option.name}
              multiple={true}
              options={skillOptions}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default Others;
