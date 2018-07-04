import { GrafooClient } from "@grafoo/types";
import * as React from "react";
import { render } from "react-dom";
import App from "./App";

export default function bootstrap(client: GrafooClient) {
  render(<App client={client} />, document.getElementById("mnt"));
}
