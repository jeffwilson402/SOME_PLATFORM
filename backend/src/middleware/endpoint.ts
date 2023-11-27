import { Request, Response, NextFunction } from "express";
import { CognitoIdentityServiceProvider } from "aws-sdk";
const EndPointMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.headers.authorization || "";
  if (!token) return res.status(401).send({ message: "unauthorized" });
  next();
  // try {
  //   const identityServiceProvider = new CognitoIdentityServiceProvider({
  //     region: process.env.AWS_REGION || "ap-northeast-1",
  //   });
  //   const rawUser = await identityServiceProvider
  //     .getUser({ AccessToken: token })
  //     .promise();
  //   if (rawUser) next();
  //   else res.status(401).send({ message: "unauthorized" });
  // } catch (error) {
  //   res.status(401).send({ message: "unauthorized", error });
  // }
};

export default EndPointMiddleWare;
