import React from "react";
import { Consumer } from "@grafoo/react";

import { ALL_POSTS, CREATE_POST, DELETE_POST, UPDATE_POST } from "./queries";
import Posts from "./Posts";

const mutations = {
  createPost: {
    query: CREATE_POST,
    optimisticUpdate: ({ allPosts }, variables) => ({
      allPosts: [{ ...variables, id: "tempID" }, ...allPosts]
    }),
    update: ({ allPosts }, { createPost: post }) => ({
      allPosts: allPosts.map(p => (p.id === "tempID" ? post : p))
    })
  },
  updatePost: {
    query: UPDATE_POST,
    optimisticUpdate: ({ allPosts }, variables) => ({
      allPosts: allPosts.map(p => (p.id === variables.id ? variables : p))
    }),
    update: ({ allPosts }, { updatePost: post }) => ({
      allPosts: allPosts.map(p => (p.id === post.id ? post : p))
    })
  },
  deletePost: {
    query: DELETE_POST,
    optimisticUpdate: ({ allPosts }, { id }) => ({
      allPosts: allPosts.filter(_ => _.id !== id)
    }),
    update: ({ allPosts }, { deletePost: { id } }) => ({
      allPosts: allPosts.filter(_ => _.id !== id)
    })
  }
};

export default function PostsContainer() {
  return (
    <Consumer query={ALL_POSTS} variables={{ orderBy: "createdAt_DESC" }} mutations={mutations}>
      {props => <Posts {...props} />}
    </Consumer>
  );
}
