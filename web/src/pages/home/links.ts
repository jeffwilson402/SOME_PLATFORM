import OnBoardLogo from "assets/images/svg/onboard.svg";
import ElasticBoardLogo from "assets/images/svg/elastic_board.svg";
import ProjectLogo from "assets/images/svg/projects.svg";
import AnalysisLogo from "assets/images/svg/analysis.svg";
import ElasticFinancialsLogo from "assets/images/svg/elastic_financial.svg";
import RolesLogo from "assets/images/svg/roles.svg";
import SkillsLogo from "assets/images/svg/skills.svg";
import LearningMapLogo from "assets/images/svg/learning_map.svg";
import CoreTeamLogo from "assets/images/svg/core_team.svg";
import GlobalSettingsLogo from "assets/images/svg/global_settings.svg";
import DistributedAppLogo from "assets/images/svg/distributed_app.svg";

const links: { key: string; title: string; image: any; link: string }[] = [
  {
    key: "onboard",
    title: "OnBoard",
    image: OnBoardLogo,
    link: "/onboard",
  },
  {
    key: "elastic_talent_board",
    title: "Elastic Talent Board",
    image: ElasticBoardLogo,
    link: "/elastic_talent_board",
  },
  {
    key: "projects",
    title: "Projects",
    image: ProjectLogo,
    link: "/projects",
  },
  {
    key: "analysis",
    title: "Analysis",
    image: AnalysisLogo,
    link: "/analysis",
  },
  {
    key: "elastic_team_financials",
    title: "Elastic Team Financials",
    image: ElasticFinancialsLogo,
    link: "/elastic_financials",
  },
  {
    key: "roles",
    title: "Roles",
    image: RolesLogo,
    link: "/roles",
  },
  {
    key: "skills",
    title: "Skills",
    image: SkillsLogo,
    link: "/skills",
  },
  // {
  //   key: "learning_maps",
  //   title: "Learning Map",
  //   image: LearningMapLogo,
  //   link: "/learning_map",
  // },
  // {
  //   key: "requisitions",
  //   title: "Requisition",
  //   image: LearningMapLogo,
  //   link: "/requisitions",
  // },
  {
    key: "core_team",
    title: "Core Team",
    image: CoreTeamLogo,
    link: "/core_team",
  },
  // {
  //   key:"global",
  //   title: "Global Settings",
  //   image: GlobalSettingsLogo,
  //   link: "/global_settings",
  // },
  // {
  //   key:"distributed_app",
  //   title: "Distributed Engineer App",
  //   image: DistributedAppLogo,
  //   link: "/distributed_app",
  // },
];

export default links;
