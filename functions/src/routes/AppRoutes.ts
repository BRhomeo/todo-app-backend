import CommonRoutesConfig from "../common/CommonRoutesConfig";
import TODOController from "../controllers/TODOController";
import FirebaseAuthMiddleware from "../middleware/FirebaseAuthMiddleware";
import { RouteItem } from "./RoutesBuilder";
const todoController = new TODOController();
export default class AppRoutes extends CommonRoutesConfig {
  constructor() {
    super("appController");
  }

  public configureRoutes(): Array<RouteItem> {
    const middlewareArr = [new FirebaseAuthMiddleware().verifyIdToken];

    const setTODO = {
      path: "/todo",
      method: "post",
      middleware: middlewareArr,
      handler: [todoController.setTODO],
    } as RouteItem;

    const getTODOList = {
      path: "/todo",
      method: "get",
      middleware: middlewareArr,
      handler: [todoController.getTODOList],
    } as RouteItem;

    const deleteTODO = {
      path: "/todo/:id",
      method: "delete",
      middleware: middlewareArr,
      handler: [todoController.deleteTODO],
    } as RouteItem;

    const updateTODO = {
      path: "/todo/:id",
      method: "put",
      middleware: middlewareArr,
      handler: [todoController.updateTODO],
    } as RouteItem;

    return [setTODO, getTODOList, deleteTODO, updateTODO] as Array<RouteItem>;
  }
}
