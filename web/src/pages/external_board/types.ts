export type ExternalUserSkill = {
  _id: string;
  indexKey: string;
  name: string;
  description: string;
  level: number;
  claimDate: string;
  approved: boolean;
  approvedBy: string;
};

export type ExternalUserRole = {
  _id: string;
  name: string;
  indexKey: string;
  startDate: string;
  endDate: string;
};

export type ExternalUser = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  roles: ExternalUserRole[];
  skills: ExternalUserSkill[];
  availablity: string;
  createdAt: string;
};
export type EvaluationTask = {
  max_result: number;
  name: string;
  prg_lang: string;
  result: string;
  task_name: string;
};
export type Evaluation = {
  name: string;
  start_date: string;
  close_date: string;
  max_result: number;
  result: string;
  tasks: EvaluationTask[];
};

export type CodilityTest = {
  url: string;
  id: number;
  name: string;
  createDate: Date;
  isArchived: boolean;
  publicTestLink: string;
  inviteUrl: string;
  sessionsUrl: string;
  totalNumberOfTasks: number;
  possibleTotalScore: number;
  timeLimit: number;
};
