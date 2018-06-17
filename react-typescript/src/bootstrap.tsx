import { ClientInstance } from "@grafoo/types";
import * as React from "react";
import { render } from "react-dom";
import App from "./App";

export default function bootstrap(client: ClientInstance) {
  render(<App client={client} />, document.getElementById("mnt"));
}
