import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import useRouteData from "../utils/use-route-data";

const _routes: any = [];
Object.values(import.meta.globEager("../**/*.routes.ts")).map((v) => {
  _routes.push(...v.default.routes);
});

const routes: Array<RouteRecordRaw> = _routes;
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to: any, from: any, next: any) => {
  return next();
});
// When each route is finished evaluating...
router.afterEach((routeTo, routeFrom) => {
  useRouteData.params = routeTo.params;
  useRouteData.query = routeTo.query;
});
export default router;
