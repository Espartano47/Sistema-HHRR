<template>
  <MainLayout>
    <div class="container-fluid p-0">
      <h1 class="h3 mb-3">Usuarios</h1>

      <div class="card">
        <!-- HEADER -->
        <div class="card-header">
          <div class="row align-items-center">
            <div class="col-md-6">
              <input
                v-model="search"
                type="text"
                class="form-control"
                placeholder="Buscar usuario..."
              />
            </div>

            <div class="col-md-6 text-end">
              <button class="btn btn-primary" @click="nuevoUsuario">
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
                <tr v-for="u in filteredUsuarios" :key="u.id">
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
    <div class="modal fade" id="usuarioModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <form @submit.prevent="guardarUsuario">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ isEdit ? "Editar usuario" : "Agregar usuario" }}
              </h5>
              <button type="button" class="btn-close" @click="cerrarModal"></button>
            </div>

            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Nombre</label>
                  <input v-model="form.Nombre" class="form-control" required />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Usuario</label>
                  <input v-model="form.username" class="form-control" required />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Correo</label>
                  <input
                    v-model="form.Correo"
                    type="email"
                    class="form-control"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Empresa</label>
                  <input v-model="form.NombreEmpresa" class="form-control" />
                </div>

                <div class="col-md-6">
                  <label class="form-label">País</label>
                  <input v-model="form.Pais" class="form-control" />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Nivel</label>
                  <select v-model="form.role" class="form-select" required>
                    <option value="">Seleccione</option>
                    <option value="admin">Admin</option>
                    <option value="usuario">Usuario</option>
                  </select>
                </div>

                <div class="col-md-6" v-if="!isEdit">
                  <label class="form-label">Contraseña</label>
                  <input
                    v-model="form.password"
                    type="password"
                    class="form-control"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarModal">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                {{ isEdit ? "Actualizar" : "Guardar" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import MainLayout from "@/layouts/MainLayout.vue";
import api from "@/services/api";

/* =======================
   ESTADO
======================= */
const usuarios = ref([]);
const loading = ref(true);
const error = ref(null);
const search = ref("");

const isEdit = ref(false);
const usuarioId = ref(null);

const form = ref({
  Nombre: "",
  username: "",
  Correo: "",
  NombreEmpresa: "",
  Pais: "",
  role: "",
  password: "",
});

/* =======================
   MODAL
======================= */
const abrirModal = () => {
  const el = document.getElementById("usuarioModal");
  if (!el || !window.bootstrap) return;
  window.bootstrap.Modal.getOrCreateInstance(el).show();
};

const cerrarModal = () => {
  const el = document.getElementById("usuarioModal");
  if (!el || !window.bootstrap) return;
  window.bootstrap.Modal.getOrCreateInstance(el).hide();
};

/* =======================
   CRUD
======================= */
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

const nuevoUsuario = () => {
  isEdit.value = false;
  usuarioId.value = null;

  form.value = {
    Nombre: "",
    username: "",
    Correo: "",
    NombreEmpresa: "",
    Pais: "",
    role: "",
    password: "",
  };

  abrirModal();
};

const editarUsuario = async (id) => {
  const res = await api.get(`/usuarios/${id}`);
  form.value = { ...res.data, password: "" };
  usuarioId.value = id;
  isEdit.value = true;
  abrirModal();
};

const guardarUsuario = async () => {
  if (isEdit.value) {
    await api.put(`/usuarios/${usuarioId.value}`, form.value);
  } else {
    await api.post("/usuarios", form.value);
  }

  cerrarModal();
  fetchUsuarios();
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
