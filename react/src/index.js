import "./globalstyles";

import createClient from "@grafoo/core";
import bootstrap from "./bootstrap";

const client = createClient("https://api.graph.cool/simple/v1/cj28ccc28umr50115gjodwzix");

if (process.env.NODE_ENV !== "production") {
  window.client = client;

  if (module.hot) {
    module.hot.accept(() => bootstrap(client));
  }
}

bootstrap(client);
