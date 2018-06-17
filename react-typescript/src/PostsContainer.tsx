import { Consumer } from "@grafoo/react";
import { GrafooMutations } from "@grafoo/types";
import * as React from "react";
import Posts from "./Posts";
import {
  AllPosts,
  ALL_POSTS,
  CreatePost,
  CREATE_POST,
  DeletePost,
  DELETE_POST,
  UpdatePost,
  UPDATE_POST,
  Post
} from "./queries";

interface Mutations {
  createPost: CreatePost;
  updatePost: UpdatePost;
  deletePost: DeletePost;
}

const mutations: GrafooMutations<AllPosts, Mutations> = {
  createPost: {
    query: CREATE_POST,
    optimisticUpdate: ({ allPosts }, variables: Post) => ({
      allPosts: [{ ...variables, id: "tempID" }, ...allPosts]
    }),
    update: ({ allPosts }, { createPost: post }) => ({
      allPosts: allPosts.map(p => (p.id === "tempID" ? post : p))
    })
  },
  updatePost: {
    query: UPDATE_POST,
    optimisticUpdate: ({ allPosts }, variables: Post) => ({
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

const PostsContainer: React.SFC = () => (
  <Consumer<AllPosts, Mutations>
    query={ALL_POSTS}
    variables={{ orderBy: "createdAt_DESC" }}
    mutations={mutations}
  >
    {props => <Posts {...props} />}
  </Consumer>
);

export default PostsContainer;
