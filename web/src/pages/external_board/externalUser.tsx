import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Chip, CircularProgress, Grid, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "utils/axios";
import { CodilityTest, ExternalUser, Evaluation } from "./types";
import MDButton from "components/MDButton";
import Select from "./Select";
import React from "react";

function ExternalUserBoard(): JSX.Element {
  const params = useParams();
  const [user, setUser] = useState<{
    user: ExternalUser;
    evaluations: Evaluation[];
  }>(null);
  const [codilityTests, setCodilityTests] = useState<CodilityTest[]>([]);
  const [testToSend, setTestToSend] = useState(0);
  const testToSendObj = codilityTests.find((test) => test.id === testToSend);
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`/user/external_user/getOne?id=${params.id}`);
      setUser(data);
    };
    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<CodilityTest[]>(`/user/codility/tests`);
      setCodilityTests(data);
    };
    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    if (codilityTests && codilityTests.length > 0) {
      setTestToSend(codilityTests[0].id);
    }
  }, [codilityTests]);

  const sendTestEmail = async () => {
    const urlParams = new URLSearchParams();
    urlParams.set("test", `${testToSend}`);
    urlParams.set("email", user.user.email);

    setSendingTest(true);
    await axios.post(`/user/codility/send?${urlParams.toString()}`);
    const { data } = await axios.get(`/user/external_user/getOne?id=${params.id}`);
    setUser(data);
    setSendingTest(false);
  };

  if (!user) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <div style={{ textAlign: "center" }}>
          <CircularProgress color="primary" />
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <Grid container p={2} spacing={2}>
                <Grid item xs={12}>
                  Applicant Information
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    disabled
                    fullWidth={true}
                    variant="standard"
                    defaultValue={user.user.firstName}
                    label="Last Name"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    disabled
                    fullWidth={true}
                    variant="standard"
                    defaultValue={user.user.lastName}
                    label="First Name"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    disabled
                    fullWidth={true}
                    variant="standard"
                    defaultValue={user.user.location}
                    label="Location"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    disabled
                    fullWidth={true}
                    variant="standard"
                    defaultValue={user.user.email}
                    label="Email"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    disabled
                    fullWidth={true}
                    variant="standard"
                    defaultValue={new Date(Date.parse("2022-07-07")).toDateString()}
                    label="Application date"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    disabled
                    fullWidth={true}
                    variant="standard"
                    defaultValue={new Date(Date.parse("2022-07-07")).toDateString()}
                    label="Available On"
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <Grid container p={2} spacing={2}>
                <Grid item xs={12}>
                  Claimed Roles
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {user.user.roles.map((role, index) => (
                      <Grid item key={index}>
                        <Chip label={role.name} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <Grid container p={2} spacing={2}>
                <Grid item xs={12}>
                  Claimed Skills
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {user.user.skills.map((skill, index) => (
                      <Grid item key={index}>
                        <Chip label={skill.name} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <Grid container p={2} spacing={2}>
                <Grid item xs={12}>
                  Codility Assessments
                </Grid>
                <Grid item xs={12}>
                  <Select
                    options={codilityTests.map((test) => test.name)}
                    label="Choose a test to send"
                    placeholder="Choose a test to send"
                    value={testToSendObj.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const test = codilityTests.find((test) => test.name === e.target.value);
                      if (test) {
                        setTestToSend(test.id);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  {sendingTest && <CircularProgress color="primary" />}
                  {!sendingTest && (
                    <MDButton variant="gradient" color="dark" onClick={() => sendTestEmail()}>
                      Send Test
                    </MDButton>
                  )}
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                Codility Results
              </Grid>

              {user.evaluations.map((evaluation, index) => {
                let score = "Not Completed";
                let scoreN = 0;
                if (evaluation.result !== null) {
                  score = `${evaluation.result}/${evaluation.max_result}`;
                  scoreN = Number.parseFloat(evaluation.result) / evaluation.max_result;
                }
                return (
                  <Grid item key={index} xs={4}>
                    <Card>
                      <Grid container p={2} spacing={2}>
                        <Grid item xs={9}>
                          {evaluation.name}
                        </Grid>
                        <Grid item xs={3} textAlign="right" marginTop={1}>
                          <CircularProgress variant="determinate" value={scoreN} />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            disabled
                            fullWidth={true}
                            variant="standard"
                            defaultValue={score}
                            label="Score"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            disabled
                            fullWidth={true}
                            variant="standard"
                            defaultValue={new Date(
                              Date.parse(evaluation.start_date)
                            ).toDateString()}
                            label="Start Date"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            disabled
                            fullWidth={true}
                            variant="standard"
                            defaultValue={new Date(
                              Date.parse(evaluation.close_date)
                            ).toDateString()}
                            label="End Date"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <h5>Tasks</h5>
                        </Grid>
                        {evaluation.tasks.map((task, index) => {
                          let textValue = 'Not Completed';
                          if (task.result) {
                            textValue = `${task.result} / ${task.max_result}`;
                          }
                          return (
                            <React.Fragment key={index}>
                              <Grid item xs={6}>
                                <TextField
                                  disabled
                                  fullWidth={true}
                                  variant="standard"
                                  defaultValue={textValue}
                                  label={task.name}
                                />
                              </Grid>
                            </React.Fragment>
                          );
                        })}
                      </Grid>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ExternalUserBoard;
