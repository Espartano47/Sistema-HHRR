<template>
  <div class="container mt-5">
    <h3>Perfil</h3>
    <pre>{{ user }}</pre>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: "ProfileView",
  data() {
    return {
      user: null
    };
  },
  async mounted() {
    try {
      const res = await api.get("/auth/profile");
      this.user = res.data;
    } catch (err) {
      this.$router.push("/login");
    }
  }
};
</script>
