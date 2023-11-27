import { Request, Response } from "express";
import { environment } from "../environment";
import axios from "axios";

export default {
  getClients: async (req: Request, res: Response) => {
    try {
      if (!environment.SYPHON_CODILITY_HOST) throw new Error("no syphon api found");
      const endpoint = `https://${environment.SYPHON_CODILITY_HOST}/api/sales/accounts`;
      const response = await axios({
        url: `${endpoint}?code=${environment.SYPHON_CODILITY_TOKEN}`,
        method: "get",
      });
  
      if (response.status !== 200) {
        res.status(400).send({
          message: 'Invalid response from syphon',
          error: response.data
        });
        return;
      }
  
      res.send(response.data);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Error!" });
    }
  }
};
