import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/map",
    name: "Map",
    // route level code-splitting
    // this generates a separate chunk (map.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/Map.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (!routes.find(r => r.path === to.path)) {
    next("/");
    return;
  } else {
    next();
    return;
  }
});

export default router;
