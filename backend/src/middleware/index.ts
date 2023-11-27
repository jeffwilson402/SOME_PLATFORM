import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const secret: string = process.env.JWT_SECRET || "TOPSECRET";
const middleware = (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.headers.authorization || "";
  if (!token) return res.status(401).send({ message: "unauthorized" });
  jwt.verify(token, secret, function (err, data) {
    console.log(err);
    if (err) return res.status(401).send({ message: "unauthorized" });
    req.body.user = data;
    next();
  });
};

export default middleware;
