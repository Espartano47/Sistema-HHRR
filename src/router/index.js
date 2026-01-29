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
import UsuariosView from '@/views/UsuariosView.vue';
import UsuariosPerfil from '@/views/UsuariosPerfil.vue';
import changepassword from '@/views/ChangePassword.vue';

const routes = [
  { path: "/", name: "home", component: HomeView, meta: { requiresAuth: true } },
  { path: "/canales", name: "Canales de comunicaciones", component: CanalesComunicacion, meta: { requiresAuth: true, permiso: "canales:read" } },
  { path: "/ausentismo", name: "Ausentismo", component: AusentismoView, meta: { requiresAuth: true, permiso: "ausentismo:read" } },
  { path: "/changepassword", name: "changepassword", component: changepassword, meta: { requiresAuth: true } },
  { path: "/headcount", name: "Headcount", component: Headcount, meta: { requiresAuth: true, permiso: "empleados:read"} },
  { path: "/empleados/:id", component: EmpleadoProfileView, meta: { requiresAuth: true, permiso: "empleados:read" } },
  { path: "/configuraciones/usuarios", name: "usuarios", component: UsuariosView, meta: { requiresAuth: true, permiso: "usuarios:read" } },
  { path: "/configuraciones/usuarios/:id", name: "usuariosPerfil", component: UsuariosPerfil, meta: { requiresAuth: true, permiso: "usuarios:read" } },
  { path: "/configuraciones", name: "Configuraciones", component: Configuraciones, meta: { requiresAuth: true, permiso: "usuarios:read" } },
  // { path: "/extras", name: "Horas Extras", component: HorasExtras, meta: { requiresAuth: true, permiso: "extras:read" } },
  // { path: "/terminaciones", name: "Terminaciones", component: Terminaciones, meta: { requiresAuth: true, permiso: "terminaciones:read" } },
  { path: "/login", name: "login", component: Login, meta: { public: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const userPermisos = (localStorage.getItem("permisosUsuario") || "").split(",");

  if (to.meta.requiresAuth && !token) {
    return next({ name: "login" });
  }

  if (to.name === "login" && token) {
    return next({ name: "home" });
  }

  if (to.meta.permiso && !userPermisos.includes(to.meta.permiso)) {
    return next({ name: "home" });
  }
  next();
});

export default router;
