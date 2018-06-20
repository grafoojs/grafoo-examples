import React from "react";
import { Provider } from "@grafoo/react";
import Posts from "./Posts";

export default function App({ client }) {
  return (
    <Provider client={client}>
      <Posts />
    </Provider>
  );
}
