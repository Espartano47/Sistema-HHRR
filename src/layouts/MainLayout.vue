<template>
  <div class="wrapper">
    <!-- SIDEBAR -->
    <nav
      id="sidebar"
      class="sidebar"
      :class="{ collapsed: !sidebarOpen }"
    >
      <div class="sidebar-content">
        <RouterLink class="sidebar-brand" to="/">
          <span class="align-middle">HHRR</span>
        </RouterLink>
        <AppSidebar />
      </div>
    </nav>

    <!-- MAIN -->
    <div class="main">
      <!-- NAVBAR -->
      <nav class="navbar navbar-expand navbar-light navbar-bg">
        <a class="sidebar-toggle ms-3" @click.prevent="toggleSidebar">
          <i class="hamburger align-self-center"></i>
        </a>

        <div class="navbar-collapse collapse">
          <ul class="navbar-nav navbar-align">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle d-none d-sm-inline-block"
                data-bs-toggle="dropdown"
              >
                <img
                  src="/img/avatars/avatar.jpg"
                  class="avatar img-fluid rounded me-1"
                />
                <span class="text-dark">{{ username }}</span>
              </a>

              <div class="dropdown-menu dropdown-menu-end">
                <RouterLink class="dropdown-item" to="/profile">
                  <i data-feather="user" class="me-1"></i> Profile
                </RouterLink>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" @click="logout">
                  <i data-feather="log-out" class="me-1"></i> Log out
                </a>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      <!-- CONTENT -->
      <main class="content">
        <slot />
      </main>

      <!-- FOOTER -->
      <footer class="footer">
        <div class="container-fluid">
          <div class="row text-muted">
            <div class="col-6 text-start">
              © Espartano
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import AppSidebar from "@/components/AppSidebar.vue";

const router = useRouter();

/* State */
const sidebarOpen = ref(true);
const username = ref("Usuario");

/* Restore state */
onMounted(() => {
  sidebarOpen.value = localStorage.getItem("sidebar") !== "false";
  username.value = localStorage.getItem("username") || "Usuario";

  if (window.feather) {
    window.feather.replace();
  }
});

/* Persist sidebar state */
watch(sidebarOpen, (val) => {
  localStorage.setItem("sidebar", val);
});

/* Actions */
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  router.push("/login");
};
</script>
