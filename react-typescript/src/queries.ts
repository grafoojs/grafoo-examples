import gql from "@grafoo/core/tag";

export enum PostOrderBy {
  content_ASC = "content_ASC",
  content_DESC = "content_DESC",
  createdAt_ASC = "createdAt_ASC",
  createdAt_DESC = "createdAt_DESC",
  id_ASC = "id_ASC",
  id_DESC = "id_DESC",
  title_ASC = "title_ASC",
  title_DESC = "title_DESC",
  updatedAt_ASC = "updatedAt_ASC",
  updatedAt_DESC = "updatedAt_DESC"
}

export interface AllPostsQueryVariables {
  orderBy?: PostOrderBy | null;
}

export interface Post {
  id: string;
  title: string | null;
  content: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AllPosts {
  allPosts: Array<Post>;
}

export interface CreatePost {
  createPost: Post | null;
}

export interface UpdatePost {
  updatePost: Post | null;
}

export interface DeletePost {
  deletePost: Post | null;
}

export const ALL_POSTS = gql`
  query AllPosts($orderBy: PostOrderBy) {
    allPosts(orderBy: $orderBy) {
      id
      title
      content
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($content: String, $title: String, $authorId: ID) {
    createPost(content: $content, title: $title, authorId: $authorId) {
      id
      title
      content
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String, $content: String) {
    updatePost(id: $id, title: $title, content: $content) {
      id
      title
      content
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;
