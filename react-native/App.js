import { Provider } from "@grafoo/react";
import React from "react";
import createClient from "./create-client";
import Posts from "./Posts";

const client = createClient();

export default () => (
  <Provider client={client}>
    <Posts />
  </Provider>
);
