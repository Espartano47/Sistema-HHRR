<template>
  <main class="d-flex w-100">
    <div class="container d-flex flex-column">
      <div class="row vh-100">
        <div class="col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto d-table h-100">
          <div class="d-table-cell align-middle">

            <div class="text-center mt-4">
              <h1 class="h2">Welcome back!</h1>
              <p class="lead">
                Sign in to your account to continue
              </p>
            </div>

            <div class="card">
              <div class="card-body">
                <div class="m-sm-3">
                  <form @submit.prevent="login">

                    <div class="mb-3">
                      <label class="form-label">Usuario</label>
                      <input
                        v-model="username"
                        class="form-control form-control-lg"
                        type="text"
                        placeholder="Enter your username"
                        required
                      />
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Password</label>
                      <input
                        v-model="password"
                        class="form-control form-control-lg"
                        type="password"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <div class="d-grid gap-2 mt-3">
                      <button class="btn btn-lg btn-primary" type="submit">
                        Sign in
                      </button>
                    </div>

                    <p v-if="error" class="text-danger mt-3 text-center">
                      {{ error }}
                    </p>

                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import api from "@/services/api";

export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
      remember: true,
      error: null
    };
  },
  methods: {
    async login() {
      this.error = null;

      try {
        const form = new FormData();
        form.append("username", this.username);
        form.append("password", this.password);

        const res = await api.post("/auth/login", form);

        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("username", res.data.UserLogin);
        localStorage.setItem(
          "forcePasswordChange",
          res.data.forcePasswordChange
        );

        if (res.data.forcePasswordChange === 1 || res.data.forcePasswordChange === true) {
          this.$router.push("/changepassword");
        } else {
          this.$router.push("/");
        }
      } catch (err) {
        this.error = "Usuario o contraseña incorrectos";
      }
    }
  }
};
</script>
