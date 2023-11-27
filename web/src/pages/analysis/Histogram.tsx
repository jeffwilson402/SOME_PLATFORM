import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import HorizontalBarChart from "./HorizontalBarChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import axios from "utils/axios";
import { useBackdrop } from "context/backdrop";
import { AnalysisColors } from "interfaces/enums";

const initialChartData: any = {
  labels: [],
  datasets: [
    {
      label: "",
      color: "dark",
      data: [],
    },
  ],
};

const initialSetting: any = {
  height: 500,
  perBar: 45,
};

const customSetting: any = {
  goals_accomplished: {
    height: 1100,
    perBar: 90,
    label: ["# of Accomplished Goals", "# of Not Accomplished"],
    color: ["success", "error"],
  },
};

function Histogram(): JSX.Element {
  const { fetching } = useBackdrop();
  const [chartData, setChartData] = useState(initialChartData);
  const location = useLocation();
  const current_location = location.pathname.split("/")[2];
  const [height, setHeight] = useState(
    current_location === "goals_accomplished"
      ? customSetting[current_location].height
      : initialSetting.height
  );

  const getSetting = () => {
    return current_location === "goals_accomplished"
      ? customSetting[current_location]
      : initialSetting;
  };

  const getData = async () => {
    try {
      fetching(true);
      const {
        data: { data, labels },
      } = await axios.get(location.pathname);
      const setting = getSetting();
      if (data.length >= 10) setHeight(setting.perBar * data.length);
      let datasets: any = [];
      if (current_location === "goals_accomplished") {
        datasets = data.map((row: any, i: number) => ({
          label: setting.label[i],
          backgroundColor: setting.color[i],
          // color: setting.color[i],
          data: row,
        }));
      } else {
        datasets = [{
          label: getTitle() == "Total Skilled Engineers" ? "# of Skills" : "# of Engineers",
          color: "dark",
          data: data,
        }];
      }
      setChartData({
        labels,
        datasets,
      });
    } catch (error) {
      console.error(error);
    } finally {
      fetching(false);
    }
  };
  const getTitle = () => {
    let temp = location.pathname.split("/")[2].split("_");
    temp = temp.map((t: string) => t[0].toUpperCase() + t.slice(1));
    return temp.join(" ");
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={4}>
        <HorizontalBarChart
          icon={{ color: "info", component: <BarChartIcon /> }}
          chart={chartData}
          title={getTitle()}
          height={height}
          color={AnalysisColors[current_location]}
        />
      </MDBox>
    </DashboardLayout>
  );
}

export default Histogram;
