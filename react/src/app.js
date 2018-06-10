import React from "react";
import { Provider } from "@grafoo/react";
import PostsContainer from "./PostsContainer";

export default function App({ client }) {
  return (
    <Provider client={client}>
      <PostsContainer />
    </Provider>
  );
}
