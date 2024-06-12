import CommonRoutesConfig from "../common/CommonRoutesConfig";
import AuthController from "../controllers/AuthController";
// import FirebaseAuthMiddleware from "../middleware/FirebaseAuthMiddleware";
import { RouteItem } from "./RoutesBuilder";
const authController = new AuthController();
export default class AuthRoutes extends CommonRoutesConfig {
  constructor() {
    super("AuthRoutes");
  }

  public configureRoutes(): Array<RouteItem> {
    // const middlewareArr = [new FirebaseAuthMiddleware().verifyIdToken];
    const signIn = {
      path: "/auth/signin",
      method: "post",
      middleware: [],
      handler: [authController.signIn],
    } as RouteItem;

    const signup = {
      path: "/auth/signup",
      method: "post",
      middleware: [],
      handler: [authController.signUp],
    } as RouteItem;

    const signOut = {
      path: "/auth/signout",
      method: "post",
      middleware: [],
      handler: [authController.signOut],
    } as RouteItem;

    const refreshToken = {
      path: "/auth/refresh-token",
      method: "post",
      middleware: [],
      handler: [authController.refreshToken],
    } as RouteItem;

    // TODO: add those features
    // const verifyEmail = {
    //     path: "/auth/verify-email",
    //     method: "post",
    //     middleware: [],
    //     handler: [authController.verifyEmail],
    //   } as RouteItem;
    // const resetPassword = {
    //     path: "/auth/reset-password",
    //     method: "post",
    //     middleware: [],
    //     handler: [authController.resetPassword],
    //   } as RouteItem;

    // const verifyEmailCode = {
    //   path: "/auth/verify-email-code",
    //   method: "post",
    //   middleware: [],
    //   handler: [authController.verifyEmailCode],
    // } as RouteItem;
    // const updateAuthData = {
    //   path: "/auth/update-auth-data",
    //   method: "post",
    //   middleware: middlewareArr,
    //   handler: [authController.updateAuthData],
    // } as RouteItem;
    return [
      signIn,
      signOut,
      signup,
      refreshToken,
      //   verifyEmail,
      // resetPassword,
      // workerSignup,
      // verifyEmailCode,
    ] as Array<RouteItem>;
  }
}
