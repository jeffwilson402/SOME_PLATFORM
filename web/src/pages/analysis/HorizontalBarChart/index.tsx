/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { ReactNode, useMemo } from "react";

// react-chartjs-2 components
import { Bar } from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// HorizontalBarChart configurations
import configs from "examples/Charts/BarCharts/HorizontalBarChart/configs";

// Material Dashboard 2 PRO React TS Base Styles
import colors from "assets/theme/base/colors";

// Declaring props types for HorizontalBarChart
interface Props {
  icon?: {
    color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
    component: ReactNode;
  };
  title?: string;
  description?: string | ReactNode;
  height?: string | number;
  chart: {
    labels: string[];
    datasets: {
      label: string;
      backgroundColor?:
        | "primary"
        | "secondary"
        | "info"
        | "success"
        | "warning"
        | "error"
        | "light"
        | "dark";
      data: number[];
    }[];
  };
  color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  [key: string]: any;
}

function HorizontalBarChart({
  icon,
  title,
  description,
  height,
  chart,
  color,
}: Props): JSX.Element {
  console.log(chart.datasets);
  const chartDatasets = chart.datasets
    ? chart.datasets.map((dataset) => ({
        ...dataset,
        weight: 5,
        borderWidth: 0,
        borderRadius: 4,
        backgroundColor: dataset.backgroundColor
          ? colors[dataset.backgroundColor].main
          : colors[color].main,
        fill: false,
        barThickness: 35,
      }))
    : [];

  const { data, options } = configs(chart.labels || [], chartDatasets);
  console.log(chartDatasets, data);

  const renderChart = (
    <MDBox py={2} pr={2} pl={icon.component ? 1 : 2}>
      {title || description ? (
        <MDBox display="flex" px={description ? 1 : 0} pt={description ? 1 : 0}>
          {icon.component && (
            <MDBox
              width="4rem"
              height="4rem"
              bgColor={icon.color || "info"}
              variant="gradient"
              coloredShadow={icon.color || "info"}
              borderRadius="xl"
              display="flex"
              justifyContent="center"
              alignItems="center"
              color="white"
              mt={-5}
              mr={2}
            >
              <Icon fontSize="medium">{icon.component}</Icon>
            </MDBox>
          )}
          <MDBox>
            {title && <MDTypography variant="h6">{title}</MDTypography>}
            <MDBox mb={2}>
              <MDTypography component="div" variant="button" color="text">
                {description}
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      ) : null}
      {useMemo(
        () => (
          <MDBox height={height}>
            <Bar data={data} options={options} />
          </MDBox>
        ),
        [chart, height]
      )}
    </MDBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

// Declaring default props HorizontalBarChart
HorizontalBarChart.defaultProps = {
  icon: { color: "info", component: "" },
  title: "",
  description: "",
  height: "19.125rem",
};

export default HorizontalBarChart;
