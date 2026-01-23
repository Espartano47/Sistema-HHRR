<template>
  <MainLayout>
    <div class="container-fluid p-0">
      <h1 class="h3 mb-3">Configuraciones</h1>

      <div class="row g-3">
        <!-- Módulo Sistema -->
        <div class="col-md-4">
          <div class="card h-100 cursor-pointer" @click="goToModule('sistema')">
            <div class="card-body text-center">
              <i class="fas fa-cogs fa-3x mb-2"></i>
              <h5 class="card-title">Sistema</h5>
              <p class="card-text">Configuraciones generales del sistema</p>
            </div>
          </div>
        </div>

        <!-- Módulo Usuarios -->
        <div class="col-md-4">
          <div class="card h-100 cursor-pointer" @click="goToModule('usuarios')">
            <div class="card-body text-center">
              <i class="fas fa-users fa-3x mb-2"></i>
              <h5 class="card-title">Usuarios</h5>
              <p class="card-text">Administrar usuarios del sistema</p>
            </div>
          </div>
        </div>

        <!-- Módulo Departamentos -->
        <div class="col-md-4">
          <div class="card h-100 cursor-pointer" @click="goToModule('departamentos')">
            <div class="card-body text-center">
              <i class="fas fa-building fa-3x mb-2"></i>
              <h5 class="card-title">Departamentos</h5>
              <p class="card-text">Administrar departamentos de la empresa</p>
            </div>
          </div>
        </div>

        <!-- Agrega más módulos aquí -->
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const goToModule = (module) => {
  // Puedes navegar a otra ruta
  router.push(`/configuraciones/${module}`);
  // o abrir un modal según el módulo
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  transition: transform 0.2s;
}
.cursor-pointer:hover {
  transform: scale(1.05);
}
</style>
