export const getFileExtension = (filename: string) => {
  const split = filename.split(".");
  if (split.length < 2) {
    return "";
  } else {
    return split[split.length - 1];
  }
};
export const convertUserToModel = (values: any, user: any) => {
  const paymentInfo = values.paymentInfo;
  const companyDetails = {
    name: values.companyName,
    address: values.companyAddress,
    phone: values.companyPhone,
    VAT: values.companyVat,
    companyId: values.companyId,
  };
  let clearance = {};
  if (values.type === "Engineer") {
    clearance = {
      bpss: values.bpss,
      ctc: values.ctc,
      sc: values.sc,
      esc: values.esc,
      dv: values.dv,
      edv: values.edv,
    };
  }
  const place = {
    location: values.location,
    timezone: values.timezone,
    language: values.language,
  };
  const skills = values.skills?.map((skill: any) => ({
    refID: skill._id,
    name: skill.name,
    approved: true,
    claimDate: new Date(),
    level: 3,
    approvedBy: skill.approvedBy ? skill.approvedBy : user.refID,
  }));
  const roles = values.roles?.map((role: any) => ({
    refID: role.refID,
    name: role.name,
  }));
  let projectDetail: any = [];
  const projectValues = values.projectDetail;
  for (let i = 0; i < projectValues.length; i++) {
    if (projectValues[i].projectId._id) {
      projectDetail.push({
        refID: projectValues[i].projectId._id,
        name: projectValues[i].projectId.name,
        projectStart: projectValues[i].projectStart,
        projectEnd: projectValues[i].projectEnd,
        projectType: projectValues[i].projectType,
        projectClient: projectValues[i].projectClient,
        proposition: projectValues[i].proposition
      });
    }
  }
  let paymentData = {};
  if (values.type === "Client") paymentData = { budget: paymentInfo };
  else paymentData = { paymentInfo };
  let noteData = {};
  if (values.note) {
    noteData = {
      notes: [{ note: values.note }],
    };
  }
  if (!values.password) delete values.password;
  return {
    ...values,
    ...paymentData,
    companyDetails,
    clearance,
    place,
    skills,
    roles,
    projectDetail,
    ...noteData,
    emailApproved: true,
    updatedAt: new Date(),
    jobType: !values.jobType ? "None" : values.jobType,
  };
};

export const convertModelToUser = (model: any) => {
  const paymentInfo =
    model.type === "Client" ? model.budget : model.paymentInfo;
  const projectDetail = model.projectDetail.map((project: any) => ({
    ...project._doc,
    projectId: project.refID,
    projectStart: project._doc.projectStart?.toISOString().substring(0, 10),
    projectEnd: project._doc.projectEnd?.toISOString().substring(0, 10),
  }));
  const flattened = {
    ...model._doc,
    ...model.clearance,
    ...model.place,
    paymentInfo,
    projectDetail,
    companyName: model.companyDetails?.name,
    companyAddress: model.companyDetails?.address,
    companyPhone: model.companyDetails?.phone,
    companyVat: model.companyDetails?.VAT,
    companyId: model.companyDetails?.companyId,
    password: "",
  };
  return flattened;
};

export const buildFields = (fields: string[]) => {
  let selection: any = {};
  if (fields) {
    fields.map((f: string) => {
      selection[f] = 1;
    });
  }
  return selection;
};

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const mbToBytes = (value:number) => {
  return value * 1024 * 1024;
}
