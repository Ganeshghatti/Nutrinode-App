// screens/LoginScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import NutriNode from "../assets/NutriNode.png";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  // const handleLoginPress = () => {
  //   // Navigate to the register screen
  //   navigation.navigate('Drawer', { screen: 'Chat' });
  // };

  const handleLoginPress = async () => {
    try {
      const userdata = {
        // Construct the userdata object
        email: email,
        password: password,
      };

      setLoading(true);
      const response = await axios.post(
        "https://nutrinode.vercel.app/user/login",
        userdata
      );
      await AsyncStorage.setItem("userData", JSON.stringify(response.data));

      navigation.navigate("Nutrition Budget");
    } catch (error) {
      setErrorMessage(error.response.data.error);
      console.error("Error registering user:", error.response.data);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={styles.spinnerText}
      />
      <Image source={NutriNode} style={styles.image} />
      <Text style={styles.heading}>Sign in</Text>
      <Text style={styles.shead}>Hi! Welcome back, you've been missed</Text>
      {/* <Text style={styles.label}>Email</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input2}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text
        style={styles.registerText}
        onPress={() => navigation.navigate("Register")}
      >
        Don't have an account? Register
      </Text>
      {errorMessage ? <Text>{errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "100%",
    backgroundColor: "#ffffff", // White background color
    // justifyContent: 'center',
    alignItems: "center",
  },
  image: {
    marginTop: 50,
    width: 250,
    height: 250,
    resizeMode: "contain",
    // marginBottom: 20,
  },
  heading: {
    marginTop: -30,
    fontSize: 29,
    fontWeight: "bold",
    marginBottom: 20,
  },
  shead: {
    fontWeight: "bold",
    color: "gray",
  },
  label: {
    // paddingTop: 60,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    marginTop: 60,
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
  },
  input2: {
    marginTop: 40,
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
  },
  loginButton: {
    marginTop: 40,
    backgroundColor: "#344B3F", // Blue color
    paddingVertical: 12,
    paddingHorizontal: 135,
    borderRadius: 45,
    marginBottom: 10,
  },
  buttonText: {
    // fontFamily: 'Arial',
    color: "#ffffff", // White color
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    color: "#888", // Gray color
  },
});

export default LoginScreen;
