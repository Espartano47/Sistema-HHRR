<template>
  <MainLayout>
    <div class="container-fluid p-0">
      <!-- <h1 class="h3 mb-3">Headcount</h1> -->

      <div class="card">
        <!-- HEADER -->
        <div class="card-header">
          <h5 class="mb-0">Headcount</h5>
            <p class="mt-0 mb-3 text-muted">Lista de empleados</p>
            <!-- <div class="col-md-6"> -->
          <div class="row align-items-center">
            
            <div class="col-md-6">
              <input
                v-model="search"
                type="text"
                class="form-control"
                placeholder="Buscar empleado..."
              />
            </div>
            <div class="col-md-6 text-end">
              <button
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#empleadoModal"
              >
                <i data-feather="plus" class="me-1"></i>
                Agregar empleado
              </button>
            </div>
          </div>
        </div>

        <div class="card-body">
          <div v-if="loading" class="text-center py-4">
            Cargando empleados...
          </div>

          <div v-else-if="error" class="text-danger text-center py-4">
            {{ error }}
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Departamento</th>
                  <th>Puesto</th>
                  <th>Salario</th>
                  <th>Fecha ingreso</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="emp in filteredEmpleados"
                  :key="emp.id"
                  class="cursor-pointer"
                  @click="goToProfile(emp.id)"
                >
                  <td>{{ emp.id }}</td>
                  <td>{{ emp.nombre }}</td>
                  <td>{{ emp.departamento }}</td>
                  <td>{{ emp.puesto }}</td>
                  <td>RD$ {{ emp.salario.toLocaleString() }}</td>
                  <td>{{ formatDate(emp.fecha_ingreso) }}</td>
                  <td>
                    <span
                      class="badge"
                      :class="emp.estado === 'Activo'
                        ? 'bg-success'
                        : 'bg-secondary'"
                    >
                      {{ emp.estado }}
                    </span>
                  </td>
                </tr>

                <tr v-if="filteredEmpleados.length === 0">
                  <td colspan="7" class="text-center text-muted">
                    No se encontraron empleados
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- MODAL -->
      <EmpleadoCreateModal @saved="fetchEmpleados" />
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import api from "@/services/api";
import EmpleadoCreateModal from "@/components/EmpleadoCreateModal.vue";

const router = useRouter();

const empleados = ref([]);
const loading = ref(true);
const error = ref(null);
const search = ref("");

const fetchEmpleados = async () => {
  loading.value = true;
  try {
    const res = await api.get("/empleados");
    empleados.value = res.data;
    await nextTick();
    if (window.feather) window.feather.replace();
  } catch (err) {
    error.value = "No se pudo cargar la lista de empleados";
  } finally {
    loading.value = false;
  }
};

const filteredEmpleados = computed(() => {
  if (!search.value) return empleados.value;
  return empleados.value.filter(emp =>
    Object.values(emp)
      .join(" ")
      .toLowerCase()
      .includes(search.value.toLowerCase())
  );
});

const formatDate = (date) =>
  new Date(date).toLocaleDateString("es-DO");

const goToProfile = (id) => {
  router.push(`/empleados/${id}`);
};

onMounted(fetchEmpleados);
</script>
