import { Grid } from "@mui/material";
import { RateCurrency, RateFrequency, RatePaymentVia } from "interfaces/enums";
import { PaymentInfoType } from "pages/onboard/schemas/initialValues";
import FormField from "../FormField";
import FormSelect from "../FormSelect";

export type RateProps = {
  rate?: PaymentInfoType;
  onChange: (rate: PaymentInfoType) => void;
  formData: any;
};

function Rate({ rate, onChange, formData }: RateProps) {
  const { formField, readonly } = formData;
  const {
    paymentDate: paymentDateField,
    rate: rateField,
    per: perField,
    currency: currencyField,
    payVia: payViaField,
  } = formField;

  function setFieldValue(field: string, value: any) {
    const updatedRate: any = rate;
    updatedRate[field] = value;
    onChange(updatedRate);
  }

  return (
    <>
      <Grid item xs={12} sm={3}>
        <FormField
          disabled={readonly}
          onChange={(e: any) => {
            setFieldValue(paymentDateField.name, e.target.value);
          }}
          type={paymentDateField.type}
          label={paymentDateField.label}
          name={paymentDateField.name}
          value={rate.paymentDate}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <FormField
          disabled={readonly}
          onChange={(e: any) => {
            setFieldValue(rateField.name, e.target.value);
          }}
          type={rateField.type}
          label={rateField.label}
          name={rateField.name}
          value={rate.amount}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <FormSelect
          disabled={readonly}
          setFieldValue={setFieldValue}
          value={rate.frequency}
          name={perField.name}
          label={perField.label}
          options={Object.values(RateFrequency)}
          disableClearable={true}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <FormSelect
          disabled={readonly}
          setFieldValue={setFieldValue}
          value={rate.currency}
          name={currencyField.name}
          label={currencyField.label}
          options={Object.values(RateCurrency)}
          disableClearable={true}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <FormSelect
          disabled={readonly}
          setFieldValue={setFieldValue}
          value={rate.paymentVia}
          name={payViaField.name}
          label={payViaField.label}
          options={Object.values(RatePaymentVia)}
          disableClearable={true}
        />
      </Grid>
    </>
  );
}

export default Rate;
