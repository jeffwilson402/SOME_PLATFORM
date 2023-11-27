export const permissionList = [
  {
    label: "Global Administrator",
    key: "global_admin",
    caption: "Unrestricted access to all features",
  },
  {
    label: "Manage Elastic Team Members",
    key: "elastic_and_onboard",
    caption: "Onboard, edit, delete and manage Elastic Team members",
  },
  {
    label: "Manage Projects",
    key: "projects",
    caption: "Add, edit and delete projects",
  },
  {
    label: "Manage User/Project Assignments",
    key: "user_project",
    caption: "Add, remove or edit the assignment of users to projects",
  },
  {
    label: "Manage Role and Skill Definitions",
    key: "role_and_skill",
    caption:
      "Create, edit and delete role & skill definitions that can be assigned to (or claimed by) Elastic Team members",
  },
  {
    label: "Manage Learning",
    key: "learning",
    caption: "Manage training content and the mappings between content and skills",
  },
  {
    label: "Manage Requisitions",
    key: "requisitions",
    caption:
      "Add, edit and delete requisitions for Elastic Team members, and post requests to Team Tailor",
  },
  {
    label: "Manage Global Settings",
    key: "global",
    caption:
      "Configure data elements and control features for the Elastic Team app and the Customer app",
  },
  {
    label: "Manage Core Team Permissions",
    key: "core_team",
    caption: "Manage access control for Core Team members",
  },
];

type TPermissionRoute = {
  [route: string]: string;
};
export const permissionRoute: TPermissionRoute = {
  // Route Key To Permission Key
  onboard: "elastic_and_onboard",
  elastic_talent_board: "elastic_and_onboard",
  external_talent_board: "elastic_and_onboard",
  projects: "projects",
  project_edit: "projects",
  analysis: "all",
  elastic_team_financials: "all",
  roles: "role_and_skill",
  skills: "role_and_skill",
  learning_maps: "learning",
  requisitions: "requisitions",
  core_team: "core_team",
  global_settings: "global",
  distributed_app: "all",
};
