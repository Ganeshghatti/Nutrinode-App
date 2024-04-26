import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [data, setData] = useState(null);
  const [editable, setEditable] = useState(false); // State to toggle edit mode
  const [editedData, setEditedData] = useState({}); // State to store edited data
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  const handleEdit = () => {
    setEditable(true); // Enable edit mode
    setEditedData(data); // Initialize edited data with current data
  };

  const handleSubmit = async () => {
    try {
      const StringuserData = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(StringuserData);
      if (userData && userData.token && userData.token.length > 0) {
        const response = await axios.put(
          `https://nutrinode.vercel.app/user/my-account`,
          editedData,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );
        setData(editedData); // Update displayed data with edited data
        setEditable(false);
      }
    } catch (error) {
      console.error("Error submitting edited data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const StringuserData = await AsyncStorage.getItem("userData");
        const userData = JSON.parse(StringuserData);
        if (userData && userData.token && userData.token.length > 0) {
          const response = await axios.get(
            `https://nutrinode.vercel.app/user/my-account`,
            {
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            }
          );
          setData(response.data.user);
        } else {
          navigation.navigate("Login"); // Navigate to Login if token is not found
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image
          source={require("../assets/NutriNode.png")}
          style={styles.profileImage}
          resizeMode="cover"
        />
      </View>
      {data && data.email && data.email.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Personal Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            {editable ? (
              <TextInput
                style={styles.input}
                value={editedData.username}
                onChangeText={(text) =>
                  setEditedData({ ...editedData, username: text })
                }
              />
            ) : (
              <Text style={styles.infoText}>
                {data.username ? <>{data.username}</> : ""}
              </Text>
            )}
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoText}>{data.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            {editable ? (
              <TextInput
                style={styles.input}
                value={editedData.phone}
                onChangeText={(text) =>
                  setEditedData({ ...editedData, phone: text })
                }
              />
            ) : (
              <Text style={styles.infoText}>
                {data.phone || "Add Your Phone"}
              </Text>
            )}
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            {editable ? (
              <TextInput
                style={styles.input}
                value={editedData.address}
                onChangeText={(text) =>
                  setEditedData({ ...editedData, address: text })
                }
              />
            ) : (
              <Text style={styles.infoText}>
                {data.address || "Add Your Address"}
              </Text>
            )}
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.editButton]}
        onPress={editable ? handleSubmit : handleEdit}
      >
        <Text style={styles.editButtonText}>
          {editable ? "Submit" : "Edit"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.editButton} onPress={handleLogout}>
        <Text style={styles.editButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 10,
    top: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // Make it circular
  },
  sectionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    top: 30,
    // bordershadowColor: '#000',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    alignItems: "center",
  },
  infoLabel: {
    fontWeight: "bold",
  },
  infoText: {
    flex: 1,
    textAlign: "right",
  },
  editButton: {
    width: 200,
    color: "white",
    backgroundColor: "#344B3F",
    paddingVertical: 8,
    borderRadius: 5,
    alignSelf: "center",
    top: 40,
    marginBottom: 10,
  },
  editButtonText: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  circle: {
    height: 170,
    width: 170,
    borderRadius: 95,
    backgroundColor: "green",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
  },
});

export default ProfileScreen;
