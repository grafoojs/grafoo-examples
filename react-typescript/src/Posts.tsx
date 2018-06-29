import { Consumer } from "@grafoo/react";
import { GrafooMutations } from "@grafoo/types";
import * as React from "react";
import * as q from "./queries";
import {
  Button,
  Center,
  Form,
  H1,
  H2,
  Input,
  Item,
  List,
  PostContent,
  Spinner,
  Textarea,
  Wrapper
} from "./ui-kit";

interface Mutations {
  createPost: q.CreatePost;
  updatePost: q.UpdatePost;
  deletePost: q.DeletePost;
}

interface State {
  title: string;
  content: string;
  id: string;
}

const mutations: GrafooMutations<q.AllPosts, Mutations> = {
  createPost: {
    query: q.CREATE_POST,
    optimisticUpdate: ({ allPosts }, variables: q.Post) => ({
      allPosts: [{ ...variables, id: "tempID" }, ...allPosts]
    }),
    update: ({ allPosts }, { createPost: post }) => ({
      allPosts: allPosts.map(p => (p.id === "tempID" ? post : p))
    })
  },
  updatePost: {
    query: q.UPDATE_POST,
    optimisticUpdate: ({ allPosts }, variables: q.Post) => ({
      allPosts: allPosts.map(p => (p.id === variables.id ? { ...p, ...variables } : p))
    })
  },
  deletePost: {
    query: q.DELETE_POST,
    optimisticUpdate: ({ allPosts }, { id }) => ({
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
    this.setState({ [value]: event.target.value } as Pick<State, typeof value>);
  };

  submit = mutate => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutate(this.state).then(() => {
      this.setState({ title: "", content: "", id: null });
    });
  };

  render() {
    const { title, content, id } = this.state;

    return (
      <Consumer query={q.ALL_POSTS} variables={variables} mutations={mutations}>
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
              <Center>
                <Spinner />
              </Center>
            )}
          </React.Fragment>
        )}
      </Consumer>
    );
  }
}
