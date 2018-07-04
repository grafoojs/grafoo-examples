import { Consumer } from "@grafoo/react";
import { GrafooMutations, Variables } from "@grafoo/types";
import * as React from "react";
import * as queries from "./queries";
import * as ui from "./ui-kit";

interface Mutations {
  createPost: queries.CreatePost;
  updatePost: queries.UpdatePost;
  deletePost: queries.DeletePost;
}

const mutations: GrafooMutations<queries.AllPosts, Mutations> = {
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
      allPosts: allPosts.map(
        p => (p.id === variables.id ? { ...p, ...variables } : p)
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

interface State {
  title: string;
  content: string;
  id: string;
}

const variables = { orderBy: "createdAt_DESC" };

export default class Posts extends React.Component<{}, State> {
  state = { title: "", content: "", id: null };

  handleChange = (value: "title" | "content") => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    this.setState({ [value]: event.target.value } as any);
  };

  submit = (mutate: (variables?: Variables) => Promise<{}>) => (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    mutate(this.state).then(() => {
      this.setState({ title: "", content: "", id: null });
    });
  };

  render() {
    const { title, content, id } = this.state;

    return (
      <Consumer query={queries.ALL_POSTS} variables={variables} mutations={mutations}>
        {props => (
          <React.Fragment>
            <ui.Wrapper>
              <ui.H1>Post Form</ui.H1>
              <ui.Form
                onSubmit={this.submit(id ? props.updatePost : props.createPost)}
              >
                <ui.Input
                  placeholder="title"
                  value={title}
                  onChange={this.handleChange("title")}
                />
                <ui.Textarea
                  placeholder="content"
                  value={content}
                  onChange={this.handleChange("content")}
                />
                <ui.Button>submit</ui.Button>
              </ui.Form>
            </ui.Wrapper>
            {props.loaded ? (
              <ui.List>
                {props.allPosts.map(({ id, title, content }) => (
                  <ui.Item key={id}>
                    <ui.Wrapper>
                      <ui.H2>{title}</ui.H2>
                      <ui.PostContent
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                      <ui.Button
                        onClick={() => this.setState({ id, title, content })}
                      >
                        update post
                      </ui.Button>{" "}
                      <ui.Button onClick={() => props.deletePost({ id })}>
                        remove post
                      </ui.Button>
                    </ui.Wrapper>
                  </ui.Item>
                ))}
              </ui.List>
            ) : (
              <ui.Center>
                <ui.Spinner />
              </ui.Center>
            )}
          </React.Fragment>
        )}
      </Consumer>
    );
  }
}
