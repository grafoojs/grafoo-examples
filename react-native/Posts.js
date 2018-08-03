import { Consumer } from "@grafoo/react";
import Expo from "expo";
import React from "react";
import { Button, Platform, ScrollView, Text, TextInput, View } from "react-native";
import PostsList from "./PostsList";
import * as queries from "./queries";

export default class Posts extends React.Component {
  state = { title: "", content: "", id: null };

  handleChange = value => text => {
    this.setState({ [value]: text });
  };

  submit = mutate => () =>
    mutate(this.state).then(() => {
      this.setState({ title: "", content: "", id: null });
    });

  render() {
    return (
      <Consumer query={queries.ALL_POSTS} variables={variables} mutations={mutations}>
        {props => (
          <View style={s.container}>
            <ScrollView>
              <View style={{ ...s.section, marginBottom: 10 }}>
                <Text style={s.h1}>Post Form</Text>
                <TextInput
                  placeholder="Title"
                  value={this.state.title}
                  multiline={false}
                  style={s.input}
                  onChangeText={this.handleChange("title")}
                />
                <TextInput
                  placeholder="Content"
                  value={this.state.content}
                  style={s.input}
                  multiline
                  onChangeText={this.handleChange("content")}
                />
                <Button
                  title="submit"
                  color="#333"
                  onPress={this.submit(this.state.id ? props.updatePost : props.createPost)}
                />
              </View>
              {props.loaded ? (
                <PostsList {...props} setPost={post => this.setState(post)} />
              ) : (
                <View style={s.section}>
                  <Text>loading</Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </Consumer>
    );
  }
}

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

const s = {
  container: {
    paddingTop: Platform.OS === "ios" ? 0 : Expo.Constants.statusBarHeight
  },
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 7.5
  },
  section: {
    paddingLeft: 7.5,
    paddingRight: 7.5
  },
  input: {
    paddingTop: 10,
    paddingRight: 5,
    paddingBottom: 10,
    paddingLeft: 5
  }
};
