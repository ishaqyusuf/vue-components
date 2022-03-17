import { RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    name: "table",
    path: "/table",
    component: () => import("../views/Table.vue"),
  },
  {
    name: "input",
    path: "/input",
    component: () => import("../views/Input.vue"),
  },
];
export default { routes };
