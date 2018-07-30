import create from "@grafoo/core";

function fetchQuery(query, variables) {
  const init = {
    method: "POST",
    body: JSON.stringify({ query, variables }),
    headers: {
      "content-type": "application/json"
    }
  };

  return fetch(
    "https://api.graph.cool/simple/v1/cj28ccc28umr50115gjodwzix",
    init
  ).then(res => res.json());
}

export default function createClient() {
  return create(fetchQuery);
}
