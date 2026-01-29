<template>
  <MainLayout>
    <div class="container-fluid p-0">
      <div class="d-flex align-items-center mb-2" style="margin-top:-10px">
        <button class="btn btn-outline-secondary btn-sm" @click="$router.back()">
          <i class="fas fa-arrow-left me-1"></i>
          Volver
        </button>
      </div>
      
      <div class="card ">
        <!-- HEADER -->
        <div class="card-header">
          <div class="row align-items-center">
            <h5 class="mb-0">Usuarios</h5>
            <p class="mt-0 mb-3 text-muted">Lista de Usuarios del sistema</p>
            <div class="col-md-6">
              <input
                v-model="search"
                type="text"
                class="form-control"
                placeholder="Buscar usuario..."
              />
            </div>

            <div class="col-md-6 text-end">
              <button
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#usuarioModal">
                <i data-feather="plus" class="me-1"></i>
                Agregar usuario
              </button>
            </div>
          </div>
        </div>
        <!-- BODY -->
        <div class="card-body">
          <div v-if="loading" class="text-center py-4">
            Cargando usuarios...
          </div>

          <div v-else-if="error" class="text-danger text-center py-4">
            {{ error }}
          </div>
          <div v-else class="table-responsive">
            <table class="table table-hover table-striped">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Empresa</th>
                  <th>País</th>
                  <th>Nivel</th>
                  <th>Último Login</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in filteredUsuarios" :key="u.id"  class="cursor-pointer" @click="irPerfilUsuario(u.id)">
                  <td>{{ u.Nombre }}</td>
                  <td>{{ u.username }}</td>
                  <td>{{ u.Correo }}</td>
                  <td>{{ u.NombreEmpresa }}</td>
                  <td>{{ u.Pais }}</td>
                  <td>{{ u.role }}</td>
                  <td>{{ formatFecha(u.LastLogin) }}</td>
                  <td>
                    <button
                      class="btn btn-sm btn-warning me-1"
                      @click="editarUsuario(u.id)"
                    >
                      Editar
                    </button>
                    <button
                      class="btn btn-sm btn-danger"
                      @click="eliminarUsuario(u.id)"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredUsuarios.length === 0">
                  <td colspan="8" class="text-center text-muted">
                    No hay usuarios
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- MODAL -->
      <UsuarioCreateModal @saved="fetchUsuarios" />
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import MainLayout from "@/layouts/MainLayout.vue";
import api from "@/services/api";
import { useRouter } from "vue-router";
import UsuarioCreateModal from "@/components/usuarios/UsuarioCreateModal.vue";

const router = useRouter();

const usuarios = ref([]);
const loading = ref(true);
const error = ref(null);
const search = ref("");

const fetchUsuarios = async () => {
  try {
    loading.value = true;
    const res = await api.get("/usuarios");
    usuarios.value = res.data;
    await nextTick();
    if (window.feather) window.feather.replace();
  } catch {
    error.value = "Error cargando usuarios";
  } finally {
    loading.value = false;
  }
};

const eliminarUsuario = async (id) => {
  if (!confirm("¿Eliminar usuario?")) return;
  await api.delete(`/usuarios/${id}`);
  fetchUsuarios();
};

/* =======================
   COMPUTED
======================= */
const filteredUsuarios = computed(() => {
  if (!search.value) return usuarios.value;
  return usuarios.value.filter((u) =>
    Object.values(u).join(" ").toLowerCase().includes(search.value.toLowerCase())
  );
});

const formatFecha = (f) => (f ? new Date(f).toLocaleString() : "—");
onMounted(fetchUsuarios);


const irPerfilUsuario = (id) => {
  router.push(`/configuraciones/usuarios/${id}`);
};

</script>


<style scoped>
.usuarios-page {
  padding: 20px;
}

.cursor-pointer {
  cursor: pointer;
}

.btn-sm {
  padding: 2px 6px;
  font-size: 0.8rem;
}
</style>
