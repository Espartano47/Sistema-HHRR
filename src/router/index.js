import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import CanalesComunicacion from "@/views/CanalesComunicacionView.vue";
import AusentismoView from "@/views/AusentismoView.vue";
import Headcount from "@/views/HeadcountView.vue";
// import HorasExtras from "@/views/HorasExtrasView.vue";
// import Terminaciones from "@/views/TerminacionesView.vue";
import Configuraciones from "@/views/ConfiguracionesView.vue";
import Login from "@/views/Login.vue";
import EmpleadoProfileView from "@/views/EmpleadoProfileView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: "/canales",
    name: "Canales de comunicaciones",
    component: CanalesComunicacion,
    meta: { requiresAuth: true }
  },
  {
    path: "/ausentismo",
    name: "Ausentismo",
    component: AusentismoView,
    meta: { requiresAuth: true }
  },
  {
    path: "/headcount",
    name: "Headcount",
    component: Headcount,
    meta: { requiresAuth: true }
  },
  {
    path: "/empleados/:id",
    component: EmpleadoProfileView,
    meta: { requiresAuth: true },
  },
  // {
  //   path: "/extras",
  //   name: "Horas Extras",
  //   component: HorasExtras,
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: "/terminaciones",
  //   name: "Terminaciones",
  //   component: Terminaciones,
  //   meta: { requiresAuth: true }
  // },
  {
    path: "/configuraciones",
    name: "Configuraciones",
    component: Configuraciones,
    meta: { requiresAuth: true }
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { public: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next({ name: "login" });
  }
  else if (to.name === "login" && token) {
    next({ name: "home" });
  }
  else {
    next();
  }
});

export default router;
