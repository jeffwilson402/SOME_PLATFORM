import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { Icon } from "@mui/material";

import { RateCurrency, RateFrequency, RatePaymentVia, UserTypes } from "interfaces/enums";
import React, { useEffect, useState } from "react";
import RateComponent from "./rate";
import { PaymentInfoType } from "pages/onboard/schemas/initialValues";

function Address({ formData }: any): JSX.Element {
  const { formField, values, errors, setFieldValue, readonly } = formData;
  const { type: typeV, paymentInfo } = values;

  const [rates, changeRates] = useState(paymentInfo as PaymentInfoType[]);
  useEffect(() => {
    setFieldValue("paymentInfo", rates);
  }, [rates]);

  function onChangeRate(index: number, rate: PaymentInfoType) {
    const updatedRates = [...rates];
    updatedRates[index] = rate;
    changeRates(updatedRates);
  }

  function onDeleteRate(index: number) {
    const updatedRates = [...rates];
    updatedRates.splice(index, 1);
    changeRates(updatedRates);
  }

  function onAddRate() {
    const updatedRates = [...rates];
    updatedRates.push({
      paymentDate: new Date(),
      amount: 0,
      frequency: RateFrequency.PerHour,
      currency: RateCurrency.USD,
      paymentVia: RatePaymentVia.Direct,
    });
    changeRates(updatedRates);
  }

  const renderRates = rates.map((rate, index) => (
    <React.Fragment key={index}>
      <RateComponent
        formData={formData}
        rate={rate}
        onChange={(rate) => onChangeRate(index, rate)}
      />
      {!readonly && index > 0 && (
        <Grid item xs={12} sm={1}>
          <MDButton iconOnly color="primary" size="small" onClick={() => onDeleteRate(index)}>
            <Icon>remove</Icon>
          </MDButton>
        </Grid>
      )}
    </React.Fragment>
  ));

  return (
    <MDBox p={3}>
      <MDTypography variant="h5" fontWeight="bold">
        {typeV == UserTypes.CLIENT ? "Budget" : "Payment Information"}
      </MDTypography>
      <MDBox mt={1.625}>
        <Grid container spacing={3}>
          {renderRates}
          {!readonly && (
            <>
              <Grid item xs={12} sm={11}></Grid>
              <Grid item xs={12} sm={1}>
                <MDButton iconOnly color="info" size="small" onClick={onAddRate}>
                  <Icon>add</Icon>
                </MDButton>
              </Grid>
            </>
          )}
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default Address;
