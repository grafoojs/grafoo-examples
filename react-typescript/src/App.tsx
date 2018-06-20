import * as React from "react";
import { Provider } from "@grafoo/react";
import PostsContainer from "./Posts";
import { ClientInstance } from "@grafoo/types";

interface Props {
  client: ClientInstance;
}

const App: React.SFC<Props> = ({ client }) => {
  return (
    <Provider client={client}>
      <PostsContainer />
    </Provider>
  );
};

export default App;
