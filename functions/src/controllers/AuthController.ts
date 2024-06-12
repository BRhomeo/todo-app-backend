import express from "express";
import { AuthService } from "../services/AuthService";

interface signInResponse {
  token: string;
  refreshToken: string;
  user: User;
}
// !next step
// TODO: will set calidation as ZOD later
export default class AuthController {
  authService = new AuthService();

  signIn = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response<Record<string, signInResponse>>> => {
    try {
      const data = req.body.data as SignIn;
      if (!data.email || !data.password) {
        return res.status(400).send("Invalid data");
      }
      const result = await this.authService.signIn(data);
      return res.status(200).send(result);
    } catch (error: any | Error) {
      return res.status(500).send(error);
    }
  };
  signUp = async (
    req: express.Request,
    res: express.Response
  ): Promise<any> => {
    try {
      const data = req.body.data as SignUp;
      if (!data || !data.email || !data.password || !data.name) {
        return res.status(400).send("Invalid data");
      }

      const result = await this.authService.signUp(data);
      return res.status(200).send(result);
    } catch (error: any | Error) {
      return res.status(500).send(error);
    }
  };
  signOut = async (
    req: express.Request,
    res: express.Response
  ): Promise<any> => {
    try {
      const result = await this.authService.signOut(req.body.data);
      return res.status(200).send(result);
    } catch (error: any | Error) {
      return res.status(500).send(error);
    }
  };

  refreshToken = async (
    req: express.Request,
    res: express.Response
  ): Promise<any> => {
    try {
      const result = await this.authService.refreshToken(req.body.data);
      return res.status(result instanceof Error ? 400 : 200).send(result);
    } catch (error: any | Error) {
      return res.status(500).send(error);
    }
  };
}
