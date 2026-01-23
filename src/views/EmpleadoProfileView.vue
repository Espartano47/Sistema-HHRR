<template>
  <MainLayout>
    <div class="container-fluid p-0">
      <div class="mb-3">
        <h1 class="h3 d-inline align-middle">Perfil del Empleado</h1>
      </div>

      <div v-if="loading" class="alert alert-info">
        Cargando empleado...
      </div>

      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-else class="row">
        <!-- PERFIL IZQUIERDO -->
        <div class="col-md-4 col-xl-3">
          <div class="card mb-3">
            <div class="card-header">
              <h5 class="card-title mb-0">Profile Details</h5>
            </div>

            <div class="card-body text-center">
              <img 
                :src="empleado.foto ? `${api.defaults.baseURL}${empleado.foto}` : 'https://via.placeholder.com/128'" 
                class="img-fluid rounded-circle mb-2"
                width="128"
                height="128"
              />

              <h5 class="card-title mb-0">{{ empleado.nombre }}</h5>
              <div class="text-muted mb-2">{{ empleado.puesto }}</div>

              <span
                class="badge"
                :class="empleado.estado === 'Activo' ? 'bg-success' : 'bg-secondary'"
              >
                {{ empleado.estado }}
              </span>
            </div>

            <hr class="my-0" />

            <div class="card-body">
              <h6 class="card-title">Información</h6>
              <ul class="list-unstyled mb-0">
                <li><strong>Departamento:</strong> {{ empleado.departamento }}</li>
                <li><strong>Salario:</strong> RD$ {{ empleado.salario }}</li>
                <li>
                  <strong>Ingreso:</strong>
                  {{ formatDate(empleado.fecha_ingreso) }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- PANEL DERECHO -->
        <div class="col-md-8 col-xl-9">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Actividad</h5>
            </div>

            <div class="card-body">
              <div class="alert alert-info">
                Próximamente: historial, ausencias, evaluaciones, etc.
              </div>

              <button class="btn btn-primary">
                Editar empleado
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "@/services/api";
import MainLayout from "@/layouts/MainLayout.vue";

const route = useRoute();
const empleado = ref(null);
const loading = ref(true);
const error = ref(null);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("es-DO");

onMounted(async () => {
  try {
    const res = await api.get(`/empleados/${route.params.id}`);
    empleado.value = res.data;
  } catch (err) {
    error.value = "Empleado no encontrado";
  } finally {
    loading.value = false;
  }
});
</script>