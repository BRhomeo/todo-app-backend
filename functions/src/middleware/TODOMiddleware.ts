import { AdminPermission } from "./../dto/enum/AdminPermission";
import express from "express";
import { DocumentData } from "firebase-admin/firestore";
import AdminProfile from "../dto/admin/AdminProfile";
import CurrentUser from "../dto/auth/CurrentUser";
import User from "../dto/common/User";
import { UserType } from "../dto/enum/UserType";
import { Collection } from "../util/Collection";
import FirebaseUtil from "../util/FirebaseUtil";

export default class FirebaseAuthMiddleware {
  public async verifyIdTokenIf(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const authHeader = (req.headers.authorization ||
      req.headers.Authorization) as string;
    if (!authHeader) {
      // return 401 if no token provided
      return res.status(401).send("No token provided!");
    }
    const verifyResult = await new FirebaseAuthMiddleware().verifyIdToken(
      req,
      res,
      next
    );
    return verifyResult;
  }

  public async verifyIdToken(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const authHeader = req.headers.authorization as string;
    try {
      if (!authHeader) {
        return res.status(401).send("No token provided!");
      }

      const token = authHeader;
      const result = await FirebaseUtil.getAuthInstance().verifyIdToken(
        token,
        true
      );
      if (result instanceof Error) {
        console.error("FirebaseAuthMiddleware => ", result);
        return res.status(401).send(result.message);
      }

      const userData = await FirebaseUtil.getFirestoreInstance<User>(
        "user"
      ).get(result.uid);
      if (userData instanceof Error) {
        return res.status(401).send("Not found");
      }
      req.body.user = {
        uid: result.uid,
        signInMethod: result.firebase.sign_in_provider,
      } as CurrentUser;

      return next();
    } catch (error: Error | any) {
      return res.status(401).send(error.message);
    }
  }
}
