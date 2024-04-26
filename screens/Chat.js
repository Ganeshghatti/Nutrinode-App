import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Keyboard,
  Modal,
  TouchableWithoutFeedback, // Import TouchableWithoutFeedback
} from "react-native";
import NutriNode from "../assets/NutriNode.png";
import Mic from "../assets/mic.png";
import Assistant from "../assets/assistant.png";
import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = () => {
  const { API_KEY } = Constants.expoConfig.extra;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  // const [isVoiceBoxVisible, setIsVoiceBoxVisible] = useState(false);

  // const OPENAI_API_KEY = ''; set open api key to work
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up function
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const analyzeImage = async () => {
    setIsGeneratingResponse(true);
    try {
      const StringuserData = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(StringuserData);

      const response = await axios.post(
        'https://nutrinode-server.vercel.app/user/chat',
        {
          email: userData.email,
          msg: inputMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        },
      );

      // Set the response data in the function or pass it to another function
      setResponseData(response.data);
    } catch (error) {
      console.error('Error making API request:', error);
    } finally {
      setIsGeneratingResponse(false); // Set back to false after response is received
    }
  };


const handleMessageSend = async () => {
  if (!firstMessageSent) {
    setFirstMessageSent(true);
  }
  if (inputMessage.trim() !== '') {
    setMessages(prevMessages => [
      ...prevMessages,
      {text: inputMessage, sender: 'user'},
    ]);
    setInputMessage('');

    // Call analyzeImage function here
    // analyzeImage();
    const StringuserData = await AsyncStorage.getItem('userData');
    const userData = JSON.parse(StringuserData);
    console.log("userdata",userData);
    // Make a POST request to the server
    try {
      const response = await axios.post(
        'https://nutrinode-server.vercel.app/user/chat',
        {
          email: userData.email,
          msg: inputMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`, // Pass the bearer token in the header
          },
        },
      );
      console.log('responsesucess', response.data);
       setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.msg, sender: "assistant" },
      ]);
      // Assuming you want to store the response data in AsyncStorage
      // await AsyncStorage.setItem('userData', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error if needed
    }
  }
};


  return (
    <View style={styles.container}>
      {/* NutriNode virtual assistant */}
      {!firstMessageSent && <Image source={NutriNode} style={styles.image} />}
      <View style={styles.assistantContainer}>
        {!isKeyboardVisible && !firstMessageSent && (
          <Text style={styles.assistantText}>
            Your virtual nutrition assistant
          </Text>
        )}
      </View>
      {/* <Modal
        animationType="fade"
        transparent={true}
        visible={isVoiceBoxVisible}
      >
        <TouchableWithoutFeedback onPress={toggleVoiceBox}>
          <View style={styles.modalBackground}>
            <View style={styles.VoiceContainer}>
              <View style={styles.Voicebox}>
                <Text style={styles.Voiceboxtext}>NutriNode</Text>
                <Image
                  source={Assistant}
                  style={{ width: 125, height: 125, margin: "auto" }}
                />
                <Text style={styles.Voiceboxtext}>Ask me anything...</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal> */}
      {/* Chat messages */}
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          console.log("message",message),
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.sender === "user"
                ? styles.userMessage
                : styles.assistantMessage,
            ]}
          >
            <Text
              style={
                message.sender === "user"
                  ? styles.userMessageText
                  : styles.assistantMessageText
              }
            >
              {message.text}
            </Text>
          </View>
        ))}
        {isGeneratingResponse && (
          <View style={[styles.assistantMessage, styles.messageBubble]}>
            <Text style={{ color: "#ffffff" }}>Generating response...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          multiline={true}
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleMessageSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
        {/* 
        <TouchableOpacity style={styles.voiceButton} onPress={startListening}>
          <Image source={Mic} style={{ width: 50, height: 50 }} />
        </TouchableOpacity> */}
      </View>

      {/* Additional text below chat box */}
      <Text style={styles.additionalText}>
        ChatGPT can make mistakes. Consider checking main information
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    marginTop: 50,
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  assistantContainer: {
    position: "absolute",
    left: "42%",
    transform: [{ translateX: -50 }],
  },
  assistantText: {
    top: -20,
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    color: "gray",
  },
  messagesContainer: {
    flex: 1,
    width: "100%",
  },
  messageBubble: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxWidth: "70%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#F6F6F6",
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#344B3F",
    color: "#ffffff",
  },
  userMessageText: {},
  assistantMessageText: {
    color: "#ffffff",
  },
  messageText: {
    color: "#ffffff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
    marginBottom: 10,
    width: "100%",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 150,
  },
  sendButton: {
    backgroundColor: "#344B3F",
    borderRadius: 25, // Make it a circle
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  voiceButton: {
    marginLeft: 10,
    fontSize: 24,
  },
  voiceButtonText: {
    fontSize: 24,
    height: 45,
  },
  additionalText: {
    textAlign: "center",
    fontStyle: "italic",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  VoiceContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    width: "80%",
    maxWidth: 300,
    paddingVertical: 30,
  },
  Voicebox: {
    alignItems: "center",
  },
  Voiceboxtext: {
    fontWeight: "bold",
    fontSize: 20,
    margin: 5,
  },
});

export default ChatScreen;
