import React from "react";
import { View, StyleSheet } from "react-native";
import BlogDetailsSvg from "../assets/Svg/BlogDetails";

export default function BlogDetails() {
  return (
    <View style={styles.container}>
      <BlogDetailsSvg />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
