import Analytics from "layouts/dashboards/analytics";
import Sales from "layouts/dashboards/sales";
import ProfileOverview from "layouts/pages/profile/profile-overview";
import AllProjects from "layouts/pages/profile/all-projects";
import NewUser from "layouts/pages/users/new-user";
import Settings from "layouts/pages/account/settings";
import Billing from "layouts/pages/account/billing";
import Invoice from "layouts/pages/account/invoice";
import Timeline from "layouts/pages/projects/timeline";
import PricingPage from "layouts/pages/pricing-page";
import Widgets from "layouts/pages/widgets";
import RTL from "layouts/pages/rtl";
import Charts from "layouts/pages/charts";
import Notifications from "layouts/pages/notifications";
import Kanban from "layouts/applications/kanban";
import Wizard from "layouts/applications/wizard";
import DataTables from "layouts/applications/data-tables";
import Calendar from "layouts/applications/calendar";
import NewProduct from "layouts/ecommerce/products/new-product";
import EditProduct from "layouts/ecommerce/products/edit-product";
import ProductPage from "layouts/ecommerce/products/product-page";
import OrderList from "layouts/ecommerce/orders/order-list";
import OrderDetails from "layouts/ecommerce/orders/order-details";
import SignInBasic from "layouts/authentication/sign-in/basic";
import SignInCover from "layouts/authentication/sign-in/cover";
import SignInIllustration from "layouts/authentication/sign-in/illustration";
import SignUpCover from "layouts/authentication/sign-up/cover";
import ResetCover from "layouts/authentication/reset-password/cover";

// Material Dashboard 2 PRO React TS components
import MDAvatar from "components/MDAvatar";

// @mui icons
import Icon from "@mui/material/Icon";

// Images
import profilePicture from "assets/images/team-3.jpg";

import { UserTypes } from "interfaces/enums";

// Page Components
import Home from "pages/home";
import OnBoard from "pages/onboard";
import CoreTeam from "pages/core_team";
import Project from "pages/project";
import Skill from "pages/skill";
import Role from "pages/role";
import CreateRole from "pages/role/Role";
import ElasticBoard from "pages/elastic_board";
import Login from "pages/auth/Login";
import AuthGuard from "pages/auth/AuthGuard";
import Logout from "pages/auth/Logout";
import Financials from "pages/financials";
import EngineerApp from "pages/engineer_app";
import Profile from "pages/engineer_app/Profile";
import Analysis from "pages/analysis";
import Histogram from "pages/analysis/Histogram";
import AddSkill from "pages/elastic_board/AddSkill";
import AddRole from "pages/elastic_board/AddRole";
import ReviewSkill from "pages/elastic_board/ReviewSkill";
import ManageTeam from "pages/project/ManageTeam";
import ExternalTalentBoard from "pages/external_board";
import ExternalUserBoard from "pages/external_board/externalUser";

const routes = [
  {
    type: "collapse",
    name: "UserName",
    key: "username",
    icon: <MDAvatar src={profilePicture} size="sm" />,
    collapse: [
      {
        name: "Logout",
        type: "button",
        key: "logout",
        route: "/logout",
        component: <Logout />,
      },
    ],
  },
  { type: "divider", key: "divider-0" },
  {
    name: "Login",
    key: "login",
    component: <Login />,
    route: "/login",
  },
  {
    type: "collapse",
    name: "Home",
    key: "home",
    component: (
      <AuthGuard type={[UserTypes.CORE]}>
        <Home />
      </AuthGuard>
    ),
    icon: <Icon fontSize="medium">home</Icon>,
    route: "/home",
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "OnBoard",
    key: "onboard",
    component: (
      <AuthGuard type={[UserTypes.CORE]}>
        <OnBoard />
      </AuthGuard>
    ),
    icon: <Icon fontSize="medium">rocket_launch</Icon>,
    route: "/onboard",
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Elastic Talent Board",
    key: "elastic_talent_board",
    component: <ElasticBoard />,
    icon: <Icon fontSize="medium">grid_on</Icon>,
    route: "/elastic_talent_board",
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "New Applicants",
    key: "external_talent_board",
    component: <ExternalTalentBoard />,
    icon: <Icon fontSize="medium">summarize</Icon>,
    route: "/external_talent_board",
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Projects",
    key: "projects",
    component: <Project />,
    icon: <Icon fontSize="medium">calendar_month</Icon>,
    route: "/projects",
    noCollapse: true,
  },
  {
    name: "Manage Team",
    key: "manage_team",
    component: <ManageTeam />,
    route: "/projects/:id/manage_team",
  },
  {
    name: "Talent Edit",
    key: "project_edit",
    component: <OnBoard onePage={true} />,
    route: "/elastic_talent_board/:id/edit",
  },
  {
    name: "Talent View",
    key: "project_edit",
    component: <OnBoard onePage={true} readonly={true} />,
    route: "/elastic_talent_board/:id/view",
  },
  {
    name: "External Talent View",
    key: "project_edit",
    component: <ExternalUserBoard />,
    route: "/external_talent_board/:id/view",
  },
  {
    name: "Add Skills",
    key: "add_skills",
    component: <AddSkill />,
    route: "/elastic_talent_board/:id/add_skills",
  },
  {
    name: "Add Roles",
    key: "add_roles",
    component: <AddRole />,
    route: "/elastic_talent_board/:id/add_roles",
  },
  {
    name: "Review Skills",
    key: "review_skills",
    component: <ReviewSkill />,
    route: "/elastic_talent_board/:id/review_skills",
  },
  {
    type: "collapse",
    name: "Analysis",
    key: "analysis",
    component: <Analysis />,
    icon: <Icon fontSize="medium">pie_chart</Icon>,
    route: "/analysis",
    noCollapse: true,
  },
  {
    name: "Total Skilled Engineers",
    key: "total_skilled_engineers",
    component: <Histogram />,
    route: "/analysis/total_skilled_engineers",
  },
  {
    name: "Assigned Roles",
    key: "assigned_roles",
    component: <Histogram />,
    route: "/analysis/assigned_roles",
  },
  {
    name: "Claimed Skills",
    key: "claimed_skills",
    component: <Histogram />,
    route: "/analysis/claimed_skills",
  },
  {
    name: "Project Assignments",
    key: "project_assignments",
    component: <Histogram />,
    route: "/analysis/project_assignments",
  },
  {
    name: "External Registrants",
    key: "external_registrants",
    component: <Histogram />,
    route: "/analysis/external_registrants",
  },
  {
    name: "Goals Accomplished",
    key: "goals_accomplished",
    component: <Histogram />,
    route: "/analysis/goals_accomplished",
  },
  {
    type: "collapse",
    name: "Elastic Team Financials",
    key: "elastic_team_financials",
    component: <Financials />,
    icon: <Icon fontSize="medium">paid</Icon>,
    route: "/elastic_financials",
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Roles",
    key: "roles",
    component: <Role />,
    icon: <Icon fontSize="medium">group</Icon>,
    route: "/roles",
    noCollapse: true,
  },
  {
    name: "Create Role",
    key: "role_create",
    component: <CreateRole />,
    route: "/roles/create",
  },
  {
    name: "Edit Role",
    key: "role_edit",
    component: <CreateRole />,
    route: "/roles/edit/:_id",
  },
  {
    type: "collapse",
    name: "Skills",
    key: "skills",
    component: <Skill />,
    icon: <Icon fontSize="medium">workspace_premium</Icon>,
    route: "/skills",
    noCollapse: true,
  },
  // {
  //   type: "collapse",
  //   name: "Learning Maps",
  //   key: "learning_maps",
  //   component: <ProfileOverview />,
  //   icon: <Icon fontSize="medium">location_on</Icon>,
  //   route: "/learning_map",
  //   noCollapse: true,
  // },
  // {
  //   type: "collapse",
  //   name: "Requisitions",
  //   key: "requisitions",
  //   component: <ProfileOverview />,
  //   icon: <Icon fontSize="medium">shopping_cart</Icon>,
  //   route: "/requisitions",
  //   noCollapse: true,
  // },
  {
    type: "collapse",
    name: "Core Team",
    key: "core_team",
    component: <CoreTeam />,
    icon: <Icon fontSize="medium">security</Icon>,
    route: "/core_team",
    noCollapse: true,
  },
  // {
  //   type: "collapse",
  //   name: "Global Settings",
  //   key: "global_settings",
  //   component: <ProfileOverview />,
  //   icon: <Icon fontSize="medium">settings</Icon>,
  //   route: "/global_settings",
  //   noCollapse: true,
  // },
  // {
  //   type: "collapse",
  //   name: "Distributed Engineer App",
  //   key: "distributed_app",
  //   component: (
  //     <AuthGuard type={[UserTypes.ENGINEER, UserTypes.CORE]}>
  //       <EngineerApp />
  //     </AuthGuard>
  //   ),
  //   icon: <Icon fontSize="medium">play_circle_outline</Icon>,
  //   href: "/distributed_app",
  //   route: "/distributed_app",
  //   noCollapse: true,
  // },
  {
    name: "Engineer Profile",
    key: "engineer_profile",
    component: <Profile />,
    route: "/engineer/profile",
  },
  {
    type: "collapse",
    name: "Dashboards",
    key: "dashboards",
    icon: <Icon fontSize="medium">dashboard</Icon>,
    collapse: [
      {
        name: "Analytics",
        key: "analytics",
        route: "/dashboards/analytics",
        component: <Analytics />,
      },
      {
        name: "Sales",
        key: "sales",
        route: "/dashboards/sales",
        component: <Sales />,
      },
    ],
  },
  // { type: "title", title: "Pages", key: "title-pages" },
  {
    type: "collapse",
    name: "Pages",
    key: "pages",
    icon: <Icon fontSize="medium">image</Icon>,
    collapse: [
      {
        name: "Profile",
        key: "profile",
        collapse: [
          {
            name: "Profile Overview",
            key: "profile-overview",
            route: "/pages/profile/profile-overview",
            component: <ProfileOverview />,
          },
          {
            name: "All Projects",
            key: "all-projects",
            route: "/pages/profile/all-projects",
            component: <AllProjects />,
          },
        ],
      },
      {
        name: "Users",
        key: "users",
        collapse: [
          {
            name: "New User",
            key: "new-user",
            route: "/pages/users/new-user",
            component: <NewUser />,
          },
        ],
      },
      {
        name: "Account",
        key: "account",
        collapse: [
          {
            name: "Settings",
            key: "settings",
            route: "/pages/account/settings",
            component: <Settings />,
          },
          {
            name: "Billing",
            key: "billing",
            route: "/pages/account/billing",
            component: <Billing />,
          },
          {
            name: "Invoice",
            key: "invoice",
            route: "/pages/account/invoice",
            component: <Invoice />,
          },
        ],
      },
      {
        name: "Projects",
        key: "projects",
        collapse: [
          {
            name: "Timeline",
            key: "timeline",
            route: "/pages/projects/timeline",
            component: <Timeline />,
          },
        ],
      },
      {
        name: "Pricing Page",
        key: "pricing-page",
        route: "/pages/pricing-page",
        component: <PricingPage />,
      },
      { name: "RTL", key: "rtl", route: "/pages/rtl", component: <RTL /> },
      { name: "Widgets", key: "widgets", route: "/pages/widgets", component: <Widgets /> },
      { name: "Charts", key: "charts", route: "/pages/charts", component: <Charts /> },
      {
        name: "Notfications",
        key: "notifications",
        route: "/pages/notifications",
        component: <Notifications />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Applications",
    key: "applications",
    icon: <Icon fontSize="medium">apps</Icon>,
    collapse: [
      {
        name: "Kanban",
        key: "kanban",
        route: "/applications/kanban",
        component: <Kanban />,
      },
      {
        name: "Wizard",
        key: "wizard",
        route: "/applications/wizard",
        component: <Wizard />,
      },
      {
        name: "Data Tables",
        key: "data-tables",
        route: "/applications/data-tables",
        component: <DataTables />,
      },
      {
        name: "Calendar",
        key: "calendar",
        route: "/applications/calendar",
        component: <Calendar />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Ecommerce",
    key: "ecommerce",
    icon: <Icon fontSize="medium">shopping_basket</Icon>,
    collapse: [
      {
        name: "Products",
        key: "products",
        collapse: [
          {
            name: "New Product",
            key: "new-product",
            route: "/ecommerce/products/new-product",
            component: <NewProduct />,
          },
          {
            name: "Edit Product",
            key: "edit-product",
            route: "/ecommerce/products/edit-product",
            component: <EditProduct />,
          },
          {
            name: "Product Page",
            key: "product-page",
            route: "/ecommerce/products/product-page",
            component: <ProductPage />,
          },
        ],
      },
      {
        name: "Orders",
        key: "orders",
        collapse: [
          {
            name: "Order List",
            key: "order-list",
            route: "/ecommerce/orders/order-list",
            component: <OrderList />,
          },
          {
            name: "Order Details",
            key: "order-details",
            route: "/ecommerce/orders/order-details",
            component: <OrderDetails />,
          },
        ],
      },
    ],
  },
  {
    type: "collapse",
    name: "Authentication",
    key: "authentication",
    icon: <Icon fontSize="medium">content_paste</Icon>,
    collapse: [
      {
        name: "Sign In",
        key: "sign-in",
        collapse: [
          {
            name: "Basic",
            key: "basic",
            route: "/authentication/sign-in/basic",
            component: <SignInBasic />,
          },
          {
            name: "Cover",
            key: "cover",
            route: "/authentication/sign-in/cover",
            component: <SignInCover />,
          },
          {
            name: "Illustration",
            key: "illustration",
            route: "/authentication/sign-in/illustration",
            component: <SignInIllustration />,
          },
        ],
      },
      {
        name: "Sign Up",
        key: "sign-up",
        collapse: [
          {
            name: "Cover",
            key: "cover",
            route: "/authentication/sign-up/cover",
            component: <SignUpCover />,
          },
        ],
      },
      {
        name: "Reset Password",
        key: "reset-password",
        collapse: [
          {
            name: "Cover",
            key: "cover",
            route: "/authentication/reset-password/cover",
            component: <ResetCover />,
          },
        ],
      },
    ],
  },
  // { type: "divider", key: "divider-1" },
  // { type: "title", title: "Docs", key: "title-docs" },
  {
    type: "collapse",
    name: "Basic",
    key: "basic",
    icon: <Icon fontSize="medium">upcoming</Icon>,
    collapse: [
      {
        name: "Getting Started",
        key: "getting-started",
        collapse: [
          {
            name: "Overview",
            key: "overview",
            href: "https://www.creative-tim.com/learning-lab/react/overview/material-dashboard/",
          },
          {
            name: "License",
            key: "license",
            href: "https://www.creative-tim.com/learning-lab/react/license/material-dashboard/",
          },
          {
            name: "Quick Start",
            key: "quick-start",
            href: "https://www.creative-tim.com/learning-lab/react/quick-start/material-dashboard/",
          },
          {
            name: "Build Tools",
            key: "build-tools",
            href: "https://www.creative-tim.com/learning-lab/react/build-tools/material-dashboard/",
          },
        ],
      },
      {
        name: "Foundation",
        key: "foundation",
        collapse: [
          {
            name: "Colors",
            key: "colors",
            href: "https://www.creative-tim.com/learning-lab/react/colors/material-dashboard/",
          },
          {
            name: "Grid",
            key: "grid",
            href: "https://www.creative-tim.com/learning-lab/react/grid/material-dashboard/",
          },
          {
            name: "Typography",
            key: "base-typography",
            href: "https://www.creative-tim.com/learning-lab/react/base-typography/material-dashboard/",
          },
          {
            name: "Borders",
            key: "borders",
            href: "https://www.creative-tim.com/learning-lab/react/borders/material-dashboard/",
          },
          {
            name: "Box Shadows",
            key: "box-shadows",
            href: "https://www.creative-tim.com/learning-lab/react/box-shadows/material-dashboard/",
          },
          {
            name: "Functions",
            key: "functions",
            href: "https://www.creative-tim.com/learning-lab/react/functions/material-dashboard/",
          },
          {
            name: "Routing System",
            key: "routing-system",
            href: "https://www.creative-tim.com/learning-lab/react/routing-system/material-dashboard/",
          },
        ],
      },
    ],
  },
  {
    type: "collapse",
    name: "Components",
    key: "components",
    icon: <Icon fontSize="medium">view_in_ar</Icon>,
    collapse: [
      {
        name: "Alerts",
        key: "alerts",
        href: "https://www.creative-tim.com/learning-lab/react/alerts/material-dashboard/",
      },
      {
        name: "Avatar",
        key: "avatar",
        href: "https://www.creative-tim.com/learning-lab/react/avatar/material-dashboard/",
      },
      {
        name: "Badge",
        key: "badge",
        href: "https://www.creative-tim.com/learning-lab/react/badge/material-dashboard/",
      },
      {
        name: "Badge Dot",
        key: "badge-dot",
        href: "https://www.creative-tim.com/learning-lab/react/badge-dot/material-dashboard/",
      },
      {
        name: "Box",
        key: "box",
        href: "https://www.creative-tim.com/learning-lab/react/box/material-dashboard/",
      },
      {
        name: "Buttons",
        key: "buttons",
        href: "https://www.creative-tim.com/learning-lab/react/buttons/material-dashboard/",
      },
      {
        name: "Date Picker",
        key: "date-picker",
        href: "https://www.creative-tim.com/learning-lab/react/datepicker/material-dashboard/",
      },
      {
        name: "Dropzone",
        key: "dropzone",
        href: "https://www.creative-tim.com/learning-lab/react/dropzone/material-dashboard/",
      },
      {
        name: "Editor",
        key: "editor",
        href: "https://www.creative-tim.com/learning-lab/react/quill/material-dashboard/",
      },
      {
        name: "Input",
        key: "input",
        href: "https://www.creative-tim.com/learning-lab/react/input/material-dashboard/",
      },
      {
        name: "Pagination",
        key: "pagination",
        href: "https://www.creative-tim.com/learning-lab/react/pagination/material-dashboard/",
      },
      {
        name: "Progress",
        key: "progress",
        href: "https://www.creative-tim.com/learning-lab/react/progress/material-dashboard/",
      },
      {
        name: "Snackbar",
        key: "snackbar",
        href: "https://www.creative-tim.com/learning-lab/react/snackbar/material-dashboard/",
      },
      {
        name: "Social Button",
        key: "social-button",
        href: "https://www.creative-tim.com/learning-lab/react/social-buttons/material-dashboard/",
      },
      {
        name: "Typography",
        key: "typography",
        href: "https://www.creative-tim.com/learning-lab/react/typography/material-dashboard/",
      },
    ],
  },
  {
    type: "collapse",
    name: "Change Log",
    key: "changelog",
    href: "https://github.com/creativetimofficial/ct-material-dashboard-pro-react/blob/main/CHANGELOG.md",
    icon: <Icon fontSize="medium">receipt_long</Icon>,
    noCollapse: true,
  },
];

export default routes;
