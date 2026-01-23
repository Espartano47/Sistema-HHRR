import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "@/assets/css/app.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap"; // JS de Bootstrap

createApp(App).use(router).mount("#app");
