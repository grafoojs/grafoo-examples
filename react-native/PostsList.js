import React from "react";
import { Button, FlatList, Text, View } from "react-native";

export default function PostsList(props) {
  return (
    <FlatList
      data={props.allPosts.map(p => ({ ...p, key: p.id }))}
      renderItem={({ item: { title, content, id }, index }) => (
        <View style={s.post(index)}>
          <Text style={s.h2}>{title.toUpperCase()}</Text>
          <View style={s.hr} />
          <Text>{content}</Text>
          <View style={s.btns}>
            <View style={s.btn()}>
              <Button
                title="update"
                color="#333"
                onPress={() => props.setPost({ id, title, content })}
              />
            </View>
            <View style={s.btn(1)}>
              <Button
                title="delete"
                color="#333"
                onPress={() => props.deletePost({ id })}
                style={s.btn(1)}
              />
            </View>
          </View>
        </View>
      )}
    />
  );
}

const s = {
  h2: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 7.5
  },
  hr: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    marginBottom: 7.5
  },
  post: index => ({
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 7.5,
    paddingRight: 7.5,
    ...(index % 2 === 0 ? { backgroundColor: "#efefef" } : {})
  }),
  btns: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10
  },
  btn: hasMargin => ({
    marginLeft: hasMargin ? 7.5 : 0
  })
};
