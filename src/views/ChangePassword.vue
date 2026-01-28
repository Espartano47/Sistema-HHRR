<template>
    <div class="container mt-5" style="max-width: 500px">
      <div class="card shadow">
        <div class="card-body">
          <h4 class="mb-3 text-center">Cambiar contraseña</h4>

          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <div v-if="success" class="alert alert-success">
            Contraseña actualizada correctamente
          </div>

          <form @submit.prevent="cambiarPassword">
            <!-- Password actual -->
            <div class="mb-3">
              <label class="form-label">Contraseña actual</label>
              <input
                v-model="currentPassword"
                type="password"
                class="form-control"
                required
              />
            </div>

            <!-- Nueva password -->
            <div class="mb-3">
              <label class="form-label">Nueva contraseña</label>
              <input
                v-model="newPassword"
                type="password"
                class="form-control"
                required
              />
              <small class="text-muted">
                Debe contener al menos 1 mayúscula y 1 número
              </small>
            </div>

            <!-- Confirmación -->
            <div class="mb-3">
              <label class="form-label">Confirmar nueva contraseña</label>
              <input
                v-model="confirmPassword"
                type="password"
                class="form-control"
                required
              />
            </div>

            <button class="btn btn-primary w-100" :disabled="loading">
              {{ loading ? "Guardando..." : "Cambiar contraseña" }}
            </button>
          </form>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

const router = useRouter();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const error = ref("");
const success = ref(false);
const loading = ref(false);

const validarPassword = () => {
  const regexMayuscula = /[A-Z]/;
  const regexNumero = /[0-9]/;

  if (!regexMayuscula.test(newPassword.value)) {
    return "La contraseña debe tener al menos una mayúscula";
  }

  if (!regexNumero.test(newPassword.value)) {
    return "La contraseña debe tener al menos un número";
  }

  if (newPassword.value === currentPassword.value) {
    return "La nueva contraseña no puede ser igual a la anterior";
  }

  if (newPassword.value !== confirmPassword.value) {
    return "Las contraseñas no coinciden";
  }

  return null;
};

const cambiarPassword = async () => {
  error.value = "";
  success.value = false;

  const validationError = validarPassword();
  if (validationError) {
    error.value = validationError;
    return;
  }

  loading.value = true;

  try {
    await api.post("/auth/change-password", {
      current_password: currentPassword.value,
      new_password: newPassword.value,
    });

    success.value = true;

    // Ya no forzar cambio
    localStorage.setItem("forcePasswordChange", "false");

    // Redirigir al home luego de 2s
    setTimeout(() => {
      router.push("/");
    }, 1500);

  } catch (err) {
    error.value =
      err.response?.data?.detail || "Error al cambiar la contraseña";
  } finally {
    loading.value = false;
  }
};
</script>
