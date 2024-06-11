import express from "express";
import CommonRoutesConfig from "./common/CommonRoutesConfig";
import AppRoutes from "./routes/AppRoutes";
import RoutesBuilder, {RouteItem} from "./routes/RoutesBuilder";
import * as http from "http";

console.log("app.ts");
const app: express.Application = RoutesBuilder.getInstance(); // express();

const routes: Array<CommonRoutesConfig> = [];
const routeItems: Array<RouteItem> = [];

routes.push(new AppRoutes());
routes.forEach((item) => {
  routeItems.push(...item.configureRoutes());
});
RoutesBuilder.setup(app, routeItems);

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send("Welcome!");
});
app.get("/test", (req: express.Request, res: express.Response) => {
  res.status(200).send("Welcome!");
});


// const server: http.Server = http.createServer(app);
// server.listen("3000", () => {
//   console.log(`Server running at http://localhost:3000`);
//   routes.forEach((route: CommonRoutesConfig) => {
//     console.log(`Routes configured for ${route.getName()}`);
//   });
// });
export default app;
