<script setup>
import { ref } from "vue";
import { Modal } from "bootstrap";
import api from "@/services/api";

const emit = defineEmits(["saved"]);

const form = ref({
  nombre: "",
  departamento: "",
  puesto: "",
  salario: "",
  fecha_ingreso: "",
  estado: "Activo",
});

const foto = ref(null); // archivo seleccionado
const error = ref(null);

const onFileChange = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    foto.value = e.target.files[0];
  }
};

const guardarEmpleado = async () => {
  error.value = null;

  try {
    const formData = new FormData();
    Object.entries(form.value).forEach(([k, v]) => formData.append(k, v));
    if (foto.value) formData.append("foto", foto.value);

    await api.post("/empleados", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    emit("saved");

    const modalEl = document.getElementById("usuarioModal");
    const modal = Modal.getInstance(modalEl);
    modal.hide();

    form.value = {
      nombre: "",
      departamento: "",
      puesto: "",
      salario: "",
      fecha_ingreso: "",
      estado: "Activo",
    };
    foto.value = null;

  } catch (err) {
    error.value = "Error al guardar empleado";
  }
};
</script>

<template>
  <div class="modal fade" id="usuarioModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Agregar Empleado</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <form @submit.prevent="guardarEmpleado">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nombre</label>
                <input v-model="form.nombre" type="text" class="form-control" required />
              </div>

              <div class="col-md-6">
                <label class="form-label">Departamento</label>
                <input v-model="form.departamento" type="text" class="form-control" required />
              </div>

              <div class="col-md-6">
                <label class="form-label">Puesto</label>
                <input v-model="form.puesto" type="text" class="form-control" required />
              </div>

              <div class="col-md-6">
                <label class="form-label">Salario</label>
                <input v-model="form.salario" type="number" class="form-control" required />
              </div>

              <div class="col-md-6">
                <label class="form-label">Fecha de ingreso</label>
                <input v-model="form.fecha_ingreso" type="date" class="form-control" required />
              </div>

              <div class="col-md-6">
                <label class="form-label">Estado</label>
                <select v-model="form.estado" class="form-select">
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div class="col-md-12">
                <label class="form-label">Foto (opcional)</label>
                <input type="file" class="form-control" @change="onFileChange" />
              </div>
            </div>

            <div v-if="error" class="alert alert-danger mt-3">
              {{ error }}
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
