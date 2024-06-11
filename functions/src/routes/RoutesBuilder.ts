import cors from "cors";
import express, {RequestHandler} from "express";
import device from "express-device";
import * as expressWinston from "express-winston";
import * as winston from "winston";

export default class RoutesBuilder {
  private static app: express.Application = express();

  public static getInstance(): express.Application {
    RoutesBuilder.app.use(device.capture());
    RoutesBuilder.app.use(express.json());
    RoutesBuilder.app.use(express.urlencoded({extended: true}));
    RoutesBuilder.app.use(cors());
    RoutesBuilder.app.use(
      expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
        ),
      })
    );
    return RoutesBuilder.app;
  }

  public static setup(
    app: express.Application,
    routes: Array<RouteItem>
  ): express.Application {
    const application =
      app !== null && app !== undefined ? app : RoutesBuilder.app;
    if (routes) {
      RoutesBuilder.appendRoutes(application, routes);
    }
    return application;
  }
  private static appendRoutes(
    application: express.Application,
    routes: Array<RouteItem>
  ): void {
    routes.forEach((route: RouteItem) => {
      let methods = route.methods || [];
      methods = methods.map((m) => m.toLowerCase());
      if (route.method) {
        if (!methods.includes(route.method.toLowerCase())) {
          methods.push(route.method.toLowerCase());
        }
      }
      for (const method of methods) {
        switch (method) {
        case "post":
          application.route(route.path).post(route.middleware, route.handler);
          break;
        case "get":
          application.route(route.path).get(route.middleware, route.handler);
          break;
        case "put":
          application.route(route.path).put(route.middleware, route.handler);
          break;
        case "delete":
          application
            .route(route.path)
            .delete(route.middleware, route.handler);
          break;
        case "search":
          application
            .route(route.path)
            .search(route.middleware, route.handler);
          break;
        default:
          console.error(`Method [${method}] is not allowed`);
          break;
        }
      }
    });
  }
}
export interface RouteItem {
  path: string;
  method?: "post" | "get" | "delete" | "put" | "search";
  methods?: Array<string>;
  middleware: Array<RequestHandler<any>>;
  handler: Array<RequestHandler<any>>;
}
