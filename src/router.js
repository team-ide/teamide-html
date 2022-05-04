import { createRouter, createWebHashHistory } from "vue-router";

import Index from "views/Index.vue";
import ToolboxPage from "views/toolbox/Page.vue";

const routes = [
  {
    path: "/",
    name: "",
    component: Index
  },
  {
    path: "/index",
    name: "index",
    component: Index
  },
  {
    path: "/toolbox",
    name: "toolbox",
    component: ToolboxPage
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})