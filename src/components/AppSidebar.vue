<script setup>
import { ref, onMounted, computed, onUpdated } from "vue";
import { RouterLink } from "vue-router";
import feather from "feather-icons"


const permisosUsuario = ref([]);

onMounted(() => {
  const permisos = localStorage.getItem("permisosUsuario") || "";
  permisosUsuario.value = permisos.split(",");
   feather.replace()
});

onUpdated(() => {
  feather.replace()
})

const sidebarItems = [
  { name: "Dashboard", path: "/", icon: "sliders", permiso: null },
  { name: "Canales de comunicación", path: "/canales", icon: "user", permiso: "canales:read" },
  { name: "Ausentismo", path: "/ausentismo", icon: "user", permiso: "ausentismo:read" },
  { name: "Headcount", path: "/headcount", icon: "user", permiso: "empleados:read" },
  { name: "Configuraciones", path: "/configuraciones", icon: "user", permiso: "usuarios:read" },
];

const filteredSidebarItems = computed(() =>
  sidebarItems.filter(item => !item.permiso || permisosUsuario.value.includes(item.permiso))
);
</script>

<template>
  <ul class="sidebar-nav">
    <li class="sidebar-header">Pages</li>

    <li
      v-for="item in filteredSidebarItems"
      :key="item.path"
      class="sidebar-item"
    >
      <RouterLink
        :to="item.path"
        class="sidebar-link"
        active-class="active-menu"
      >
        <i :data-feather="item.icon"></i>
        <span>{{ item.name }}</span>
      </RouterLink>
    </li>
  </ul>
</template>
<style>
.sidebar-link {
  color: #cfd8dc;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.sidebar-link:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.active-menu {
  background-color: #2f80ed; /* azul */
  color: #ffffff !important;
  font-weight: 800;
}

/* icono activo */
.active-menu i {
  stroke: #ffffff;
}</style>