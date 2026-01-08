import type { RouteConfig } from "../utils/type";

export function defineRoutes<T extends RouteConfig[]>(
  routes: T
): T {
  return routes;
}
