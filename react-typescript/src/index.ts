import "./globalstyles";

import createClient from "@grafoo/core";
import bootstrap from "./bootstrap";
import { GrafooClient } from "@grafoo/types";

function fetchQuery(query, variables) {
  const init = {
    method: "POST",
    body: JSON.stringify({ query, variables }),
    headers: {
      "content-type": "application/json"
    }
  };

  return fetch("https://api.graph.cool/simple/v1/cj28ccc28umr50115gjodwzix", init).then(res =>
    res.json()
  );
}

const client = createClient(fetchQuery);

if (process.env.NODE_ENV !== "production") {
  window.client = client;

  if (module.hot) {
    module.hot.accept(() => bootstrap(client));
  }
}

bootstrap(client);

declare global {
  interface Window {
    client: GrafooClient;
  }
}
