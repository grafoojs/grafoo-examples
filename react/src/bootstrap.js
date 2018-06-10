import React from "react";
import { render } from "react-dom";
import App from "./App";

export default function bootstrap(client) {
  render(<App client={client} />, document.getElementById("mnt"));
}
