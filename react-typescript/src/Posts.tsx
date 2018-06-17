import { GrafooRenderProps, Variables } from "@grafoo/types";
import * as React from "react";
import { AllPosts } from "./queries";
import { Button, Form, H1, H2, Input, Item, List, PostContent, Textarea, Wrapper } from "./ui-kit";

interface Props extends GrafooRenderProps, AllPosts {
  createPost: (vars: Variables) => Promise<void>;
  updatePost: (vars: Variables) => Promise<void>;
  deletePost: (vars: Variables) => Promise<void>;
}

interface State {
  title: string;
  content: string;
  id: string;
}

export default class Posts extends React.Component<Props, State> {
  state = { title: "", content: "", id: null };

  handleChange = (value: "title" | "content") => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    this.setState({ [value]: event.target.value } as any);
  };

  submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const submit = this.props[this.state.id ? "updatePost" : "createPost"];

    submit(this.state).then(() => this.setState({ title: "", content: "", id: null }));
  };

  render() {
    const { loaded, allPosts, deletePost } = this.props;
    const { title, content } = this.state;

    return (
      <React.Fragment>
        <Wrapper>
          <H1>Post Form</H1>
          <Form onSubmit={this.submit}>
            <Input placeholder="title" value={title} onChange={this.handleChange("title")} />
            <Textarea
              placeholder="content"
              value={content}
              onChange={this.handleChange("content")}
            />
            <Button>submit</Button>
          </Form>
        </Wrapper>
        {loaded ? (
          <List>
            {allPosts.map(({ id, title, content }) => (
              <Item key={id}>
                <Wrapper>
                  <H2>{title}</H2>
                  <PostContent dangerouslySetInnerHTML={{ __html: content }} />
                  <Button onClick={() => this.setState({ id, title, content })}>
                    update post
                  </Button>{" "}
                  <Button onClick={() => deletePost({ id })}>remove post</Button>
                </Wrapper>
              </Item>
            ))}
          </List>
        ) : (
          <Wrapper>loading...</Wrapper>
        )}
      </React.Fragment>
    );
  }
}
