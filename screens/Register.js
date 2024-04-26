// screens/RegisterScreen.js

import React ,{useState, useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet ,Image,ScrollView} from 'react-native';
import NutriNode from '../assets/NutriNode.png';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from "react-native-loading-spinner-overlay";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   checkAuthToken();
  // }, []);

  // const checkAuthToken = async () => {
  //   try {
  //     const authToken = await AsyncStorage.getItem('authToken');
  //     if (authToken) {
  //       // User is already authenticated, navigate to another screen
  //       navigation.navigate('Drawer', { screen: 'Home' });// Replace 'AnotherScreen' with the screen you want to navigate to
  //     }
  //   } catch (error) {
  //     console.error('Error checking authentication:', error);
  //   }
  // };
  // const navigation = useNavigation();
  
  // const handleLoginPress = () => {
  //   // Navigate to the register screen
  //   navigation.navigate('Login');
  // };


  const handleRegisterPress = async () => {
    try {
      const userdata = {  // Construct the userdata object
        username: username,
        email: email,
        password: password,
      };
      setLoading(true);

      const response = await axios.post('https://nutrinode.vercel.app/user/register', 
        userdata,
      );
      await AsyncStorage.setItem('userData', JSON.stringify(response.data));

      navigation.navigate('Nutrition Budget');
    } catch (error) {
      // Registration failed, handle the error
      setErrorMessage(error.response.data.error);
      console.error('Error registering user:', error.response.data);
      // Optionally, display an error message to the user
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView>
    <View style={styles.container}>
    <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={styles.spinnerText}
      />
      <Image source={NutriNode} style = {styles.image} />
      <Text style={styles.heading}>Register</Text>
      <Text style={styles.shead}>Hi! Welcome , happy to see you </Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegisterPress} >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.loginText} onPress={() => navigation.navigate('Login')} >Already have an account? Login</Text>
      {errorMessage ? (
        <Text>{errorMessage}</Text>
      ) : null}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: '100%',
    backgroundColor: '#ffffff', // White background color
    // justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginTop: 50,
    width: 250,
    height: 250,
    resizeMode: 'contain',
    // marginBottom: 20,
  },
  heading: {
    marginTop: -30,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  shead: {
    fontWeight: 'bold',
    color: 'gray',
  },
  input: {
    marginTop: 40,
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
  },
  registerButton: {
    marginTop: 30,
    backgroundColor: '#344B3F', // Green color
    paddingVertical: 12,
    paddingHorizontal: 128,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff', // White color
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#888', // Gray color
    marginBottom:100
  },
});

export default RegisterScreen;
