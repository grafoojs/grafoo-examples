<template>
  <h1>Loaded: {{loaded}}</h1>
</template>

<script lang="ts">
import Vue from "vue";
import * as queries from "../queries";
import { GrafooMutations } from "@grafoo/types";

interface Mutations {
  createPost: queries.CreatePost;
  updatePost: queries.UpdatePost;
  deletePost: queries.DeletePost;
}

let query = queries.ALL_POSTS;

let variables = { orderBy: "createdAt_DESC" };

let mutations: GrafooMutations<queries.AllPosts, Mutations> = {
  createPost: {
    query: queries.CREATE_POST,
    optimisticUpdate: ({ allPosts }, variables: queries.Post) => ({
      allPosts: [{ ...variables, id: "tempID" }, ...allPosts]
    }),
    update: ({ allPosts }, { createPost: post }) => ({
      allPosts: allPosts.map(p => (p.id === "tempID" ? post : p))
    })
  },
  updatePost: {
    query: queries.UPDATE_POST,
    optimisticUpdate: ({ allPosts }, variables: queries.Post) => ({
      allPosts: allPosts.map(p =>
        p.id === variables.id ? { ...p, ...variables } : p
      )
    })
  },
  deletePost: {
    query: queries.DELETE_POST,
    optimisticUpdate: ({ allPosts }, { id }) => ({
      allPosts: allPosts.filter(_ => _.id !== id)
    })
  }
};

type Data = { allPosts: queries.Post[] };
type Methods = typeof mutations;

export default Vue.extend<Data, Methods, any>({
  grafoo: {
    query,
    variables,
    mutations
  }
});
</script>

<style>
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  color: #222;
}
</style>
