import express from "express";
import CommonRoutesConfig from "./common/CommonRoutesConfig";
import AppRoutes from "./routes/AppRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import RoutesBuilder, { RouteItem } from "./routes/RoutesBuilder";

const app: express.Application = RoutesBuilder.getInstance(); // express();

const routes: Array<CommonRoutesConfig> = [];
const routeItems: Array<RouteItem> = [];

routes.push(new AppRoutes());
routes.push(new AuthRoutes());
routes.forEach((item) => {
  routeItems.push(...item.configureRoutes());
});
RoutesBuilder.setup(app, routeItems);

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send("Welcome!");
});

export default app;
