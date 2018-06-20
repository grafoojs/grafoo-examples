import { Consumer } from "@grafoo/preact";
import { h, Component } from "preact";
import { ALL_POSTS, CREATE_POST, DELETE_POST, UPDATE_POST } from "./queries";
import { Button, Form, H1, H2, Input, Item, List, Textarea, Wrapper } from "./ui-kit";

const mutations = {
  createPost: {
    query: CREATE_POST,
    optimisticUpdate: ({ allPosts }, post) => ({
      allPosts: [{ ...post, id: "tempID" }, ...allPosts]
    }),
    update: ({ allPosts }, { createPost: post }) => ({
      allPosts: allPosts.map(p => (p.id === "tempID" ? post : p))
    })
  },
  updatePost: {
    query: UPDATE_POST,
    optimisticUpdate: ({ allPosts }, post) => ({
      allPosts: allPosts.map(p => (p.id === post.id ? post : p))
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

export default class Posts extends Component {
  state = { title: "", content: "", id: null };

  handleChange = value => event => this.setState({ [value]: event.target.value });

  submit = event => {
    event.preventDefault();

    const submit = this.props[this.state.id ? "updatePost" : "createPost"];

    submit(this.state).then(() => this.setState({ title: "", content: "", id: null }));
  };

  render({}, state) {
    return (
      <Consumer query={ALL_POSTS} variables={{ orderBy: "createdAt_DESC" }} mutations={mutations}>
        {props => (
          <div>
            <Wrapper>
              <H1>Post Form</H1>
              <Form onSubmit={this.submit}>
                <Input
                  placeholder="title"
                  value={state.title}
                  onInput={this.handleChange("title")}
                />
                <Textarea
                  placeholder="content"
                  value={state.content}
                  onInput={this.handleChange("content")}
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
                      <div
                        dangerouslySetInnerHTML={{ __html: content }}
                        style={{ marginBottom: 16 }}
                      />
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
          </div>
        )}
      </Consumer>
    );
  }
}
