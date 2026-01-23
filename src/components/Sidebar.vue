<template>
  <nav id="sidebar" class="sidebar">
    <div class="sidebar-content">
      <a class="sidebar-brand" href="#">
        <span class="align-middle">AdminKit</span>
      </a>

      <ul class="sidebar-nav">
        <li class="sidebar-header">Pages</li>

        <li class="sidebar-item">
          <router-link class="sidebar-link" to="/">
            <i class="fas fa-chart-line me-2"></i>
            <span>Dashboard</span>
          </router-link>
        </li>

        <li class="sidebar-item">
          <router-link class="sidebar-link" to="/profile">
            <i class="bi bi-person-circle me-2"></i>
            <span>Profile</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Sidebar",
};
</script>
