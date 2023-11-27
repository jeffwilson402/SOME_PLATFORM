import { Db } from "mongodb";
import { MigrationInterface } from "mongo-migrate-ts";

export class payment1654686334902 implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    const users = db.collection("users");
    await users.updateMany({}, [
      {
        $set: {
          paymentInfo: [
            {
              paymentDate: new Date(),
              amount: "$payment.rate",
              frequency: "$payment.per",
              currency: "$payment.currency",
              paymentVia: "$payment.pay_via",
            },
          ],
        },
      },
      {
        $unset: ["payment"],
      },
    ]);
  }

  public async down(db: Db): Promise<any> {
    const users = db.collection("users");
    await users.updateMany({}, [
      {
        $set: {
          payment: {
            rate: { $first: "$paymentInfo.amount" },
            per: { $first: "$paymentInfo.frequency" },
            currency: { $first: "$paymentInfo.currency" },
            pay_via: { $first: "$paymentInfo.paymentVia" },
          },
        },
      },
      {
        $unset: ["paymentInfo"],
      },
    ]);
  }
}
