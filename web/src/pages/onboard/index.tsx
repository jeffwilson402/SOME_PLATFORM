import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, FormikProps } from "formik";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import UserInfo from "./components/UserInfo";
import PaymentInfo from "./components/PaymentInfo";
import Location from "./components/Security";
import Note from "./components/Profile";
import ProjectDetail from "./components/ProjectDetail";
import CompanyInfo from "./components/CompanyInfo";
import Others from "./components/Others";

import { useBackdrop } from "context/backdrop";
import validations from "./schemas/validations";
import form from "./schemas/form";
import initialValues, { FormValueType } from "./schemas/initialValues";
import axios from "utils/axios";
import { toast } from "react-toastify";
import { JobTypes, UserTypes } from "interfaces/enums";

function getSteps(): string[] {
  return [
    "User Info",
    "Project",
    "Payment",
    "Company Info",
    "Seucrity and Location",
    "Role",
    "Note",
  ];
}

function getStepContent(stepIndex: number, formData: any): JSX.Element {
  switch (stepIndex) {
    case 0:
      return <UserInfo formData={formData} />;
    case 1:
      return <ProjectDetail formData={formData} />;
    case 2:
      return <PaymentInfo formData={formData} />;
    case 3:
      return <CompanyInfo formData={formData} />;
    case 4:
      return <Location formData={formData} />;
    case 5:
      return <Others formData={formData} />;
    case 6:
      return <Note formData={formData} />;
    default:
      return null;
  }
}

function getAllSteps(formData: any) {
  const { values } = formData;
  if (!values) {
    return [];
  }

  const steps = [
    <UserInfo formData={formData} />,
    <ProjectDetail formData={formData} />,
    <PaymentInfo formData={formData} />,
    <CompanyInfo formData={formData} />,
    <Location formData={formData} />,
    <Others formData={formData} />,
    <Note formData={formData} />,
  ];

  const stepsToShow: number[] = [];

  if (values.type == UserTypes.CORE) {
    if (values.approved) {
      stepsToShow.push(...stepMap[UserTypes.CORE]);
    } else {
      stepsToShow.push(0);
    }
  } else {
    stepsToShow.push(0);
    if (values.approved) {
      stepsToShow.push(1);
    }
    stepsToShow.push(2);
    if (values.jobType === JobTypes.CONTRACT) {
      stepsToShow.push(3);
    }
    stepsToShow.push(4);
    if (values.type == UserTypes.ENGINEER) {
      stepsToShow.push(5);
    }
  }

  return stepsToShow.map((index) => steps[index]);
}

const stepMap = {
  [UserTypes.CLIENT]: [0, 1, 2, 3, 4],
  [UserTypes.CORE]: [0, 1],
  [UserTypes.ENGINEER]: [0, 1, 2, 3, 4, 5],
};

export type OnBoardProps = {
  readonly?: boolean;
  onePage?: boolean;
};

function OnBoard({ readonly, onePage }: OnBoardProps): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetching } = useBackdrop();
  const [formValues, setFormValues] = useState(initialValues);
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const { formId, formField } = form;
  const currentValidation = validations(id ? "edit" : "new")[activeStep];
  // const isLastStep = activeStep === steps.length - 1;
  const isLastStep = (userType: UserTypes) => {
    const stepIndex = stepMap[userType].indexOf(activeStep);
    return stepMap[userType].length === stepIndex + 1;
  };

  const handleBack = (values: any) => {
    if (values.type === UserTypes.CORE) {
      if (activeStep === 6 && !values.approved) setActiveStep(0);
      else {
        const stepIndex = stepMap[UserTypes.CORE].indexOf(activeStep);
        setActiveStep(stepMap[UserTypes.CORE][stepIndex - 1]);
      }
    } else if (values.type === UserTypes.ENGINEER) {
      if (activeStep === 2 && !values.approved) setActiveStep(0);
      else if (activeStep === 4) {
        if (values.jobType === JobTypes.CONTRACT) setActiveStep(3);
        else setActiveStep(2);
      } else {
        const stepIndex = stepMap[UserTypes.ENGINEER].indexOf(activeStep);
        setActiveStep(stepMap[UserTypes.ENGINEER][stepIndex - 1]);
      }
    } else {
      if (activeStep === 2 && !values.approved) setActiveStep(0);
      else if (activeStep === 4) {
        if (values.jobType === JobTypes.CONTRACT) setActiveStep(3);
        else setActiveStep(2);
      } else {
        const stepIndex = stepMap[UserTypes.CLIENT].indexOf(activeStep);
        setActiveStep(stepMap[UserTypes.CLIENT][stepIndex - 1]);
      }
    }
  };

  const submitForm = async (values: any, actions: any) => {
    try {
      fetching(true);
      const { data } = await axios.post("/user/save", values);
      const message = `${id ? "Updated" : "Created"} A User Successfully!`;
      toast.success(message);
      actions.setSubmitting(false);
      if (!id) {
        actions.resetForm();
        setActiveStep(0);
      } else {
        setFormValues(data.updatedUser);
      }
    } catch (error: any) {
      actions.setSubmitting(false);
      toast.error(error.response.data.message);
    } finally {
      fetching(false);
    }
  };

  const handleSubmit = (values: any, actions: any) => {
    if (isLastStep(values.type) || onePage) {
      submitForm(values, actions);
    } else {
      if (values.type === UserTypes.CORE) {
        if (activeStep === 0 && !values.approved) setActiveStep(6);
        else {
          const stepIndex = stepMap[UserTypes.CORE].indexOf(activeStep);
          setActiveStep(stepMap[UserTypes.CORE][stepIndex + 1]);
        }
      } else if (values.type === UserTypes.ENGINEER) {
        if (activeStep === 0 && !values.approved) setActiveStep(2);
        else if (activeStep === 2) {
          if (values.jobType === JobTypes.CONTRACT) setActiveStep(3);
          else setActiveStep(4);
        } else {
          const stepIndex = stepMap[UserTypes.ENGINEER].indexOf(activeStep);
          setActiveStep(stepMap[UserTypes.ENGINEER][stepIndex + 1]);
        }
      } else {
        if (activeStep === 0 && !values.approved) setActiveStep(2);
        else if (activeStep === 2) {
          if (values.jobType === JobTypes.CONTRACT) setActiveStep(3);
          else setActiveStep(4);
        } else {
          const stepIndex = stepMap[UserTypes.CLIENT].indexOf(activeStep);
          setActiveStep(stepMap[UserTypes.CLIENT][stepIndex + 1]);
        }
      }
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  const getTalent = async () => {
    try {
      fetching(true);
      const { data } = await axios.get(`/user/${id}`);
      setFormValues(data);
    } catch (error: any) {
      toast.warn(error.message);
    } finally {
      fetching(false);
    }
  };

  useEffect(() => {
    if (id) getTalent();
    else {
      setActiveStep(0);
      setFormValues(initialValues);
    }
  }, [id]);

  const renderStepCards = (formProps: FormikProps<FormValueType>) => {
    const { values, errors, touched, isSubmitting, setFieldValue } = formProps;
    if (onePage) {
      return (
        <Grid container justifyContent="center" alignItems="center" rowSpacing={2}>
          {getAllSteps({
            values,
            touched,
            formField,
            errors,
            setFieldValue,
            readonly,
          }).map((step, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ height: "100%" }}>
                <MDBox>
                  <MDBox>{step}</MDBox>
                </MDBox>
              </Card>
            </Grid>
          ))}
          {!readonly && (
            <Grid item xs={12} textAlign="right">
              <MDButton
                disabled={isSubmitting}
                onClick={() => handleSubmit(values, formProps)}
                type="submit"
                variant="gradient"
                color="dark"
              >
                Save
              </MDButton>
            </Grid>
          )}
        </Grid>
      );
    }

    return (
      <Card sx={{ height: "100%" }}>
        <MDBox p={3}>
          <MDBox>
            {getStepContent(activeStep, {
              values,
              touched,
              formField,
              errors,
              setFieldValue,
              readonly,
            })}
            <MDBox mt={2} width="100%" display="flex" justifyContent="space-between">
              {activeStep === 0 ? (
                <MDBox />
              ) : (
                <MDButton variant="gradient" color="light" onClick={() => handleBack(values)}>
                  back
                </MDButton>
              )}
              {values?.type && (
                <MDButton
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(values, formProps)}
                  type="submit"
                  variant="gradient"
                  color="dark"
                >
                  {isLastStep(values.type as UserTypes) ? "send" : "next"}
                </MDButton>
              )}
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    );
  };

  const onEditClick = () => {
    if (!id) return;
    navigate(`/elastic_talent_board/${id}/edit`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={10}>
        <Grid container justifyContent="center" alignItems="center" sx={{ height: "100%", mt: 8 }}>
          {readonly && id && (
            <Grid item xs={12} lg={10} textAlign="right" marginBottom={2}>
              <MDButton onClick={onEditClick} type="button" variant="gradient" color="dark">
                Edit
              </MDButton>
            </Grid>
          )}
          <Grid item xs={12} lg={10}>
            <Formik
              enableReinitialize={true}
              initialValues={formValues}
              validationSchema={currentValidation}
              onSubmit={handleSubmit}
            >
              {(formProps) => renderStepCards(formProps)}
            </Formik>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default OnBoard;
