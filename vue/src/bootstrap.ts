import { GrafooClient } from "@grafoo/types";
import Vue from "vue";
import App from "./components/App.vue";
import { Plugin } from "./lib/plugin";

Vue.config.productionTip = process.env.NODE_ENV === "production";

export default function bootstrap(client: GrafooClient) {
  Vue.use(Plugin, client);

  new Vue({ el: "#mnt", render: h => h(App) });
}
