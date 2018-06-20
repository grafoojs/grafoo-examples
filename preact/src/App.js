import { h } from "preact";
import { Provider } from "@grafoo/preact";

import Posts from "./Posts";

export default function App({ client }) {
  return (
    <Provider client={client}>
      <Posts />
    </Provider>
  );
}
