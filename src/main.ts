import { createApp } from "vue";
import App from "./App.vue";
import "./assets/app.css";
import router from "./router";
let app = createApp(App);
app.use(router).mount("#app");
