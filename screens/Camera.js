import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Button,
  TextInput,
} from "react-native";
import { Camera } from "expo-camera";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Svg, { Circle } from "react-native-svg";

export default function App() {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Detects if the screen is focused
  const [cameraKey, setCameraKey] = useState(0); // Key to force re-mount of the camera component

  useEffect(() => {
    if (isFocused) {
      setCameraKey((prevKey) => prevKey + 1);
    }
  }, [isFocused]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoLabel}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <Button
          onPress={requestPermission}
          title="Grant Permission"
          style={styles.loginButton}
        />
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      navigation.navigate("ClickedScreen", {
        photoUri: photo.uri,
        base64img: photo.base64,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Camera key={cameraKey} style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <Text style={styles.text}>
              <Svg
                width={72}
                height={72}
                viewBox="0 0 72 72"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Circle cx={36} cy={36} r={20} fill="#344B3F" />
                <Circle
                  cx={36}
                  cy={36}
                  r={36}
                  fill="#344B3F"
                  fillOpacity={0.54}
                />
              </Svg>
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  infoLabel: {
    fontWeight: "bold",
    textAlign: "center",
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: "#344B3F", // Blue color
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginBottom: 10,
    color: "#ffffff",
    width:"60%",
    alignSelf:"center"
  },
  buttonText: {
    textAlign: "center",
    color: "#ffffff",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100, // Adjust the height as needed
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 60, // Adjust the size as needed
    height: 60, // Adjust the size as needed
    borderRadius: 30, // Makes the button circular
    justifyContent: "center",
    alignItems: "center",
    alignSelf:"center"
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
