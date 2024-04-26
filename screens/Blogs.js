import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import BlogsComponent from "../assets/Svg/Blogs";
import { useNavigation } from "@react-navigation/native";
import Topbar from "../assets/Svg/Topbar";

export default function Blogs() {
  const navigation = useNavigation();

  const handleBlogPress = () => {
    navigation.navigate("BlogDetails"); // Navigate to BlogDetails screen
  };

  const numBlogs = 3;

  const blogComponents = Array.from({ length: numBlogs }, (_, index) => (
    <TouchableOpacity key={index} onPress={handleBlogPress}>
      <View>
        <BlogsComponent />
      </View>
    </TouchableOpacity>
  ));

  return (
    <View style={styles.container}>
      <Topbar />
      {blogComponents}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
  },
  blogContainer: {
    marginBottom: 10,
    flex: 1,
  },
});
