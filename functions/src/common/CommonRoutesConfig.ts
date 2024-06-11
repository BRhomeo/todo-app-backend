import {RouteItem} from "../routes/RoutesBuilder";

export default abstract class CommonRoutesConfig {
  name: string;

  constructor(name: string) {
    this.name = name;
    // this.configureRoutes();
  }
  getName() {
    return this.name;
  }
  public abstract configureRoutes(): Array<RouteItem>;
}
