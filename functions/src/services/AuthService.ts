import axios, { AxiosRequestConfig } from "axios";
import { UserRecord } from "firebase-functions/v1/auth";
import { google } from "googleapis";
import FirebaseUtil, { Firestore } from "../util/FirebaseUtil";
import TemplatesHelper from "../util/TemplatesHelper";
import TypeDao from "../daos/TypeDao";
import { firebaseConfig } from "firebase-functions";

const projectId = firebaseConfig()?.projectId;

const API_KEY = process.env.API_KEY;
console.log(API_KEY, projectId);

export class AuthService {
  private static BASE_URL =
    "https://identitytoolkit.googleapis.com/v1/accounts";
  private userDocService = new TypeDao("user");

  signUp = async (data: SignUp): Promise<any> => {
    try {
      const result = await axios
        .request(this.getConfig("signUp", data))
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });

      if (result instanceof Error || result.status !== 200) {
        return Promise.reject(result.data);
      }
      //   create user doc
      const userDoc = await this.userDocService.set(
        {
          uid: result.data.localId,
          signInMethod: "password",
        },
        result.data.localId,
        "user",
        {
          email: data.email,
          name: data.name,
        }
      );
      return Promise.resolve({
        id: result.data.localId,
        token: result.data.idToken,
        refreshToken: result.data.refreshToken,
        expiresIn: result.data.expiresIn,
        email: result.data.email,
        userCreated: userDoc ? true : false,
      });
    } catch (error: any | Error) {
      return Promise.reject(error);
    }
  };

  signIn = async (data: SignIn): Promise<any | Error | undefined> => {
    try {
      data.returnSecureToken = true;
      const result = await axios
        .request(this.getConfig("signInWithPassword", data))
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
      if (result instanceof Error || result.status !== 200) {
        return Promise.reject(result.data);
      }
      // !get user doc
      const userData = await this.getUserDoc(result.data.localId);
      const resultData = {
        token: result.data.idToken,
        refreshToken: result.data.refreshToken,
        user: userData,
      };
      console.log("signIn resultData =>", resultData);
      return Promise.resolve(resultData);
    } catch (error: any | Error) {
      return Promise.reject(error);
    }
  };

  private getUserDoc = async (
    uid: string
  ): Promise<any | Error | undefined> => {
    try {
      const userObj = await this.userDocService.get(uid, "user");
      if (userObj instanceof Error) {
        console.log("getUserDoc result err =>", userObj.message);
        return Promise.reject(userObj);
      }

      return Promise.resolve(userObj);
    } catch (error: any | Error) {
      return Promise.reject(error);
    }
  };

  signOut = async (data: SignOut): Promise<Error | any> => {
    try {
      if (!data.idToken) {
        return new Error("idToken is required");
      }
      const verifyResult = await FirebaseUtil.getAuthInstance().verifyIdToken(
        data.idToken,
        true
      );
      if (!verifyResult || !verifyResult.uid) {
        return Promise.reject(new Error("Not valid token!"));
      }
      await FirebaseUtil.getAuthInstance().revokeRefreshTokens(
        verifyResult.uid
      );

      return Promise.resolve(true);
    } catch (error: any | Error) {
      if (error.message === "The Firebase ID token has been revoked.") {
        return Promise.resolve(true);
      }
      return Promise.reject(error);
    }
  };

  checkUserExistsByEmail = async (
    data
    // : VerificationCode
  ): Promise<boolean | UserRecord | Error> => {
    try {
      let userByEmail = {} as UserRecord;
      if (data.email) {
        userByEmail = await FirebaseUtil.getAuthInstance().getUserByEmail(
          data.email
        );
      }
      if (
        Object.hasOwnProperty.call(userByEmail, "uid") &&
        data.method === "SIGNUP"
      ) {
        return new Error("user by this email is already exists");
      }
      return userByEmail;
    } catch (error: any) {
      if (
        error.errorInfo.code === "auth/user-not-found" &&
        data.method === "SIGNUP"
      ) {
        return true;
      } else if (
        error.errorInfo.code === "auth/user-not-found" &&
        data.method === "SIGNIN"
      ) {
        return new Error("user by this email is Not exists");
      } else {
        return error;
      }
    }
  };

  refreshToken = async (data: RefreshToken): Promise<any> => {
    try {
      data.grant_type = "refresh_token";
      const config = this.getConfig(
        `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
        data
      );
      const result = await axios.request(config);
      const token = {
        idToken: result.data.id_token,
        refreshToken: result.data.refresh_token,
        expiresIn: result.data.expires_in,
      } as Token;
      return Promise.resolve(token);
    } catch (error: any | Error) {
      return Promise.reject(error);
    }
  };

  private getConfig = (path: string, data?: any): AxiosRequestConfig => {
    return {
      url: path.startsWith("https")
        ? path
        : `${AuthService.BASE_URL}:${path}?key=${API_KEY}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    } as AxiosRequestConfig;
  };
}
