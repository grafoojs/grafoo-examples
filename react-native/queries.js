import graphql from "@grafoo/core/tag";

export const ALL_POSTS = graphql`
  query getPosts($orderBy: PostOrderBy) {
    allPosts(orderBy: $orderBy) {
      title
      content
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_POST = graphql`
  mutation createPost($content: String, $title: String, $authorId: ID) {
    createPost(content: $content, title: $title, authorId: $authorId) {
      title
      content
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_POST = graphql`
  mutation updatePost($id: ID!, $title: String, $content: String) {
    updatePost(id: $id, title: $title, content: $content) {
      title
      content
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_POST = graphql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;
