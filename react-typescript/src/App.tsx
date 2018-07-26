import * as React from "react";
import { Provider } from "@grafoo/react";
import Posts from "./Posts";
import { GrafooClient } from "@grafoo/types";

interface Props {
  client: GrafooClient;
}

const App: React.SFC<Props> = ({ client }) => (
  <Provider client={client}>
    <Posts />
  </Provider>
);

export default App;
