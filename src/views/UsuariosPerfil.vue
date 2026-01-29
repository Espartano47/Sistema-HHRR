<template>
  <MainLayout>
    <div class="container-fluid p-0">
      <div class="d-flex align-items-center mb-2" style="margin-top:-10px">
        <button class="btn btn-outline-secondary btn-sm" @click="$router.back()">
          <i class="fas fa-arrow-left me-1"></i>
          Volver
        </button>
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
            <!-- HEADER -->
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">Profile Details</h5>

              <button
                class="btn btn-sm btn-outline-primary"
                @click="toggleEdit"
              >
                <i class="fas fa-edit me-1"></i>
                {{ editMode ? "Cancelar" : "Editar" }}
              </button>
            </div>

            <!-- BODY -->
            <div class="card-body text-center">
              <img
                :src="usuario.foto
                  ? `${api.defaults.baseURL}${usuario.foto}`
                  : 'https://tse4.mm.bing.net/th/id/OIP.IGNf7GuQaCqz_RPq5wCkPgHaLH?rs=1&pid=ImgDetMain&o=7&rm=3'"
                class="img-fluid rounded-circle mb-2"
                width="128"
                height="128"
              />

              <!-- NOMBRE -->
              <h5 class="card-title mb-2">
                <span v-if="!editMode">{{ usuario.Nombre }}</span>
                <input
                  v-else
                  v-model="usuarioEdit.Nombre"
                  class="form-control form-control-sm text-center"
                />
              </h5>

              <!-- CORREO -->
              <div class="mb-2">
                <span v-if="!editMode" class="text-muted">{{ usuario.Correo }}</span>
                <input
                  v-else
                  v-model="usuarioEdit.Correo"
                  class="form-control form-control-sm text-center"
                />
              </div>

              <!-- ESTADO -->
              <span
                class="badge"
                :class="usuario.estado === 'Activo' ? 'bg-success' : 'bg-secondary'"
              >
                {{ usuario.estado }}
              </span>

              <!-- GUARDAR -->
              <div v-if="editMode" class="mt-3">
                <button
                  class="btn btn-success btn-sm"
                  @click="guardarCambios"
                >
                  <i class="fas fa-save me-1"></i>
                  Guardar cambios
                </button>
              </div>
            </div>

            <hr class="my-0" />

            <!-- INFO -->
            <div class="card-body">
              <h6 class="card-title">Información</h6>
              <ul class="list-unstyled mb-0">
                <li><strong>Nombre:</strong> {{ usuario.Nombre }}</li>
                <li><strong>Correo:</strong> {{ usuario.Correo }}</li>
                <li><strong>Username:</strong> {{ usuario.username }}</li>
                <li><strong>Estado:</strong> {{ usuario.estado }}</li>
                <li><strong>Empresa:</strong> {{ usuario.NombreEmpresa }}</li>
                <li><strong>País:</strong> {{ usuario.Pais }}</li>
                <li><strong>Último login:</strong> {{ formatDate(usuario.LastLogin) }}</li>
                <li><strong>Creado:</strong> {{ formatDate(usuario.created) }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- PANEL DERECHO -->
        <div class="col-md-8 col-xl-9">
          <div class="card">
            <!-- <div class="card-header">
              <h5 class="card-title mb-0">Actividad</h5>
            </div> -->

            <div class="card-body">
            <h5 class="mb-0">Permisos</h5>
            <p class="mt-0 mb-3 text-muted">Lista de permisos de la aplicación</p>

            <table class="table table-bordered align-middle">
              <thead class="table-light">
                <tr>
                  <th>Módulo</th>
                  <th class="text-center">Read</th>
                  <th class="text-center">Create</th>
                  <th class="text-center">Update</th>
                  <th class="text-center">Delete</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(acciones, modulo) in permisosUI" :key="modulo">
                  <td class="fw-bold text-capitalize">{{ modulo }}</td>

                  <td class="text-center">
                    <input
                      type="checkbox"
                      v-model="acciones.read"
                      @change="onChangePermiso(modulo, 'read')"
                    />
                  </td>

                  <td class="text-center">
                    <input
                      type="checkbox"
                      v-model="acciones.create"
                      :disabled="!acciones.read"
                      @change="onChangePermiso(modulo, 'create')"
                    />
                  </td>

                  <td class="text-center">
                    <input
                      type="checkbox"
                      v-model="acciones.update"
                      :disabled="!acciones.read"
                      @change="onChangePermiso(modulo, 'update')"
                    />
                  </td>

                  <td class="text-center">
                    <input
                      type="checkbox"
                      v-model="acciones.delete"
                      :disabled="!acciones.read"
                      @change="onChangePermiso(modulo, 'delete')"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
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

const usuario = ref(null);
const usuarioEdit = ref({});
const loading = ref(true);
const error = ref(null);
const editMode = ref(false);

const permisos = ref([])
const permisosUsuario = ref(new Set())
const permisosUI = ref({})

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("es-DO") : "-";

const toggleEdit = () => {
  if (!editMode.value) {
    usuarioEdit.value = { ...usuario.value };
  }
  editMode.value = !editMode.value;
};

const guardarCambios = async () => {
  try {
    const formData = new FormData();

    formData.append("username", usuarioEdit.value.username);
    formData.append("rol", usuarioEdit.value.role);
    formData.append("Nombre", usuarioEdit.value.Nombre);
    formData.append("Correo", usuarioEdit.value.Correo);
    formData.append("estado", usuarioEdit.value.estado);

    // // si agregas cambio de foto
    // if (usuarioEdit.value.foto instanceof File) {
    //   formData.append("foto", usuarioEdit.value.foto);
    // }

    await api.put(`/usuarios/${route.params.id}`, formData);

    usuario.value = { ...usuarioEdit.value };
    editMode.value = false;
  } catch (err) {
    console.error(err);
    alert("Error al guardar los cambios");
  }
};

onMounted(async () => {
  try {
    const res = await api.get(`/usuarios/${route.params.id}`);
    usuario.value = res.data;

    await cargarPermisos()
  } catch (err) {
    error.value = "Usuario no encontrado";
  } finally {
    loading.value = false;
  }
});

const cargarPermisos = async () => {
  const [todos, usuarioPermisos] = await Promise.all([
    api.get("/configuraciones/permisos"),
    api.get(`/configuraciones/permisos/${route.params.id}`)
  ])

  permisos.value = todos.data

  permisosUsuario.value = new Set(
    usuarioPermisos.data.map(p => p.permiso_id)
  )

  // Construir estructura UI
  permisos.value.forEach(p => {
    const [modulo, accion] = p.nombre.split(":")

    if (!permisosUI.value[modulo]) {
      permisosUI.value[modulo] = {
        read: false,
        create: false,
        update: false,
        delete: false
      }
    }

    permisosUI.value[modulo][accion] =
      permisosUsuario.value.has(p.id)
  })
}


const togglePermiso = async (modulo, accion, checked) => {
  const permiso = permisos.value.find(
    p => p.nombre === `${modulo}:${accion}`
  )

  if (!permiso) return

  try {
    if (checked) {
      await api.post("/configuraciones/permisos/asignar", {
        usuario_id: route.params.id,
        permiso_id: permiso.id
      })
    } else {
      await api.delete("/configuraciones/permisos/quitar", {
        data: {
          usuario_id: route.params.id,
          permiso_id: permiso.id
        }
      })
    }
  } catch (e) {
    console.error("Error actualizando permiso", e)
  }
}


const onChangePermiso = async (modulo, accion) => {
  const checked = permisosUI.value[modulo][accion]

  // Si quita READ → quitar todos
  if (accion === "read" && !checked) {
    for (const a of ["create", "update", "delete"]) {
      if (permisosUI.value[modulo][a]) {
        permisosUI.value[modulo][a] = false
        await togglePermiso(modulo, a, false)
      }
    }
  }

  await togglePermiso(modulo, accion, checked)
}

</script>
