import CommonRoutesConfig from "../common/CommonRoutesConfig";
import TODOController from "../controllers/TODOController";
// import BellaaController from "../controllers/BellaaController";
import FirebaseAuthMiddleware from "../middleware/FirebaseAuthMiddleware";
// import ForbidDelete from "../middleware/ForbidDelete"; we could set this to forbid delete
import { RouteItem } from "./RoutesBuilder";
const bellaaController = new BellaaController();
export default class BellaaRoutes extends CommonRoutesConfig {
  constructor() {
    super("BellaaRoutes");
  }

  public configureRoutes(): Array<RouteItem> {
    const middlewareArr = [new FirebaseAuthMiddleware().verifyIdToken];

    const setTODO = {
      path: "/todo",
      method: "post",
      middleware: middlewareArr,
      handler: [TODOController.setTODO],
    } as RouteItem;

    const getTODOList = {
      path: "/todo",
      method: "get",
      middleware: middlewareArr,
      handler: [TODOController.getTODOList],
    } as RouteItem;

    const deleteTODO = {
      path: "/todo",
      method: "delete",
      middleware: middlewareArr,
      handler: [TODOController.deleteTODO],
    } as RouteItem;

    const updateTODO = {
      path: "/todo",
      method: "put",
      middleware: middlewareArr,
      handler: [TODOController.updateTODO],
    } as RouteItem;

    return [setTODO, getTODOList, deleteTODO, updateTODO] as Array<RouteItem>;
  }
}
