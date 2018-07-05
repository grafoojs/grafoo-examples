import { Consumer } from "@grafoo/react";
import React from "react";
import * as queries from "./queries";
import * as ui from "./ui-kit";

const mutations = {
  createPost: {
    query: queries.CREATE_POST,
    optimisticUpdate: ({ allPosts }, variables) => ({
      allPosts: [{ ...variables, id: "tempID" }, ...allPosts]
    }),
    update: ({ allPosts }, { createPost: post }) => ({
      allPosts: allPosts.map(p => (p.id === "tempID" ? post : p))
    })
  },
  updatePost: {
    query: queries.UPDATE_POST,
    optimisticUpdate: ({ allPosts }, variables) => ({
      allPosts: allPosts.map(p => (p.id === variables.id ? variables : p))
    }),
    update: ({ allPosts }, { updatePost: post }) => ({
      allPosts: allPosts.map(p => (p.id === post.id ? post : p))
    })
  },
  deletePost: {
    query: queries.DELETE_POST,
    optimisticUpdate: ({ allPosts }, { id }) => ({
      allPosts: allPosts.filter(_ => _.id !== id)
    }),
    update: ({ allPosts }, { deletePost: { id } }) => ({
      allPosts: allPosts.filter(_ => _.id !== id)
    })
  }
};

const variables = { orderBy: "createdAt_DESC" };

export default class Posts extends React.Component {
  state = { title: "", content: "", id: null };

  inputEl = React.createRef();

  handleChange = value => event => {
    this.setState({ [value]: event.target.value });
  };

  submit = mutate => event => {
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
              <ui.Form onSubmit={this.submit(id ? props.updatePost : props.createPost)}>
                <ui.Input placeholder="title" value={title} onChange={this.handleChange("title")} />
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
                      <ui.PostContent dangerouslySetInnerHTML={{ __html: content }} />
                      <ui.Button onClick={() => this.setState({ id, title, content })}>
                        update post
                      </ui.Button>{" "}
                      <ui.Button onClick={() => props.deletePost({ id })}>remove post</ui.Button>
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
