import { Consumer } from "@grafoo/react";
import { GrafooMutations } from "@grafoo/types";
import * as React from "react";
import { Button, Form, H1, H2, Input, Item, List, PostContent, Textarea, Wrapper } from "./ui-kit";
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

interface State {
  title: string;
  content: string;
  id: string;
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

const variables = { orderBy: "createdAt_DESC" };

export default class Posts extends React.Component<{}, State> {
  state = { title: "", content: "", id: null };

  handleChange = (value: "title" | "content") => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    this.setState({ [value]: event.target.value } as any);
  };

  submit = mutate => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutate(this.state).then(() => this.setState({ title: "", content: "", id: null }));
  };

  render() {
    const { title, content, id } = this.state;

    return (
      <Consumer query={ALL_POSTS} variables={variables} mutations={mutations}>
        {props => (
          <React.Fragment>
            <Wrapper>
              <H1>Post Form</H1>
              <Form onSubmit={this.submit(id ? props.updatePost : props.createPost)}>
                <Input placeholder="title" value={title} onChange={this.handleChange("title")} />
                <Textarea
                  placeholder="content"
                  value={content}
                  onChange={this.handleChange("content")}
                />
                <Button>submit</Button>
              </Form>
            </Wrapper>
            {props.loaded ? (
              <List>
                {props.allPosts.map(({ id, title, content }) => (
                  <Item key={id}>
                    <Wrapper>
                      <H2>{title}</H2>
                      <PostContent dangerouslySetInnerHTML={{ __html: content }} />
                      <Button onClick={() => this.setState({ id, title, content })}>
                        update post
                      </Button>{" "}
                      <Button onClick={() => props.deletePost({ id })}>remove post</Button>
                    </Wrapper>
                  </Item>
                ))}
              </List>
            ) : (
              <Wrapper>loading...</Wrapper>
            )}
          </React.Fragment>
        )}
      </Consumer>
    );
  }
}
