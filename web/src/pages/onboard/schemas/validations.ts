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

import * as Yup from "yup";
import checkout from "./form";

const {
  formField: {
    firstName,
    lastName,
    email,
    type,
    personal_email,
    projectDetail,
    telephone,
    location,
    timezone,
    language,

    paymentDate,
    rate,
    per,
    currency,
    payVia,
  },
} = checkout;

const validations = (mode: string) => {
  return [
    Yup.object().shape({
      [firstName.name]: Yup.string().required(firstName.errorMsg),
      [lastName.name]: Yup.string().required(lastName.errorMsg),
      [type.name]: Yup.string().required(type.errorMsg),
      [email.name]: Yup.string().required(email.errorMsg).email(email.invalidMsg),
      [personal_email.name]: Yup.string().email(email.invalidMsg),
    }),
    null,
    Yup.object()
      .shape({
        paymentInfo: Yup.array().of(
          Yup.object().shape({
            paymentDate: Yup.date().required(paymentDate.errorMsg),
            amount: Yup.number().required(rate.errorMsg).integer().min(1),
          })
        ),
      })
      .test({
        message: "paymentInfo must have at least one entry",
        test: (arr) => arr.paymentInfo.length >= 1,
      }),
    null,
    Yup.object().shape({
      [location.name]: Yup.string().required(location.errorMsg),
      [timezone.name]: Yup.string().required(timezone.errorMsg),
      [language.name]: Yup.string().required(language.errorMsg),
    }),
    null,
    null,
  ];
};

export default validations;
