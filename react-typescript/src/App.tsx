import * as React from "react";
import { Provider } from "@grafoo/react";
import Posts from "./Posts";
import { ClientInstance } from "@grafoo/types";

interface Props {
  client: ClientInstance;
}

const App: React.SFC<Props> = ({ client }) => (
  <Provider client={client}>
    <Posts />
  </Provider>
);

export default App;
