import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";

export default function ClickedScreen({ route }) {
  const { API_KEY } = Constants.expoConfig.extra;
  const { photoUri, base64img } = route.params;
  const [analysis, setAnalysis] = useState(null);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [protein, setProtein] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  //  const OPENAI_API_KEY = '';  set oopen api key to work

  const handleAddToFavorites = async () => {
    try {
      const StringuserData = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(StringuserData);
      if (userData && userData.token && userData.token.length > 0) {
        setLoading(true);

        const response = await axios.post(
          `https://nutrinode.vercel.app/user/add-to-diet`,
          {
            email: userData.email,
            item: {
              name: description,
              calories,
              carbs,
              fat,
              protein,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );
        navigation.navigate("Nutrition Budget");
      }
    } catch (error) {
      console.error("Error submitting edited data:", error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async (base64img) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4-turbo",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "What’s in this imageand description of image if it is a food, what are the values of protein, fat, carbs and calories of the food in the image.if there is no foood give it a name ? return your answer in a json object with this format  {name:'',calories:'',carbs:'',fat:'',protein:'',description:''} if image has none of these simple words return {name:'',calories:'0',carbs:'0',fat:'0',protein:'0'} keep the format same , just return the json objrct nothing else . Note - don't return any other text and always get name of the image.  ",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64img}`,
                  },
                },
              ],
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response.data.choices[0].message.content)
      // console.log(response.data.choices[0].message.content)
      setAnalysis(JSON.parse(response.data.choices[0].message.content));
      setName(JSON.parse(response.data.choices[0].message.content).name);
      setCalories(
        JSON.parse(response.data.choices[0].message.content).calories
      );
      setFat(JSON.parse(response.data.choices[0].message.content).fat);
      setCarbs(JSON.parse(response.data.choices[0].message.content).carbs);
      setProtein(JSON.parse(response.data.choices[0].message.content).protein);
      setDescription(
        JSON.parse(response.data.choices[0].message.content).description
      );

      // console.log(name,calories,carbs,fat,protein)
    } catch (error) {
      console.error(
        "Error making API request:",
        error.response ? error.response.data : error
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    analyzeImage(base64img);
  }, []);

  const nutritionInfo = {
    protein: "20g",
    calories: "300",
    fat: "10g",
    carbs: "40g",
  };

  // console.log(obj.name)
  return (
    <View style={styles.container}>
      {/* Image */}
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={styles.spinnerText}
      />
      <Image source={{ uri: photoUri }} style={styles.image} />

      {/* Nutrition info */}
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.heading}>Protein:</Text>
          {loading ? (
            <Text style={styles.data}>Loading...</Text>
          ) : (
            <Text style={styles.data}>{protein}</Text>
          )}
        </View>
        <View style={styles.row}>
          <Text style={styles.heading}>Calories:</Text>
          {loading ? (
            <Text style={styles.data}>Loading...</Text>
          ) : (
            <Text style={styles.data}>{calories}</Text>
          )}
        </View>
        <View style={styles.row}>
          <Text style={styles.heading}>Fat:</Text>
          {loading ? (
            <Text style={styles.data}>Loading...</Text>
          ) : (
            <Text style={styles.data}>{fat}</Text>
          )}
        </View>
        <View style={styles.row}>
          <Text style={styles.heading}>Carbs:</Text>
          {loading ? (
            <Text style={styles.data}>Loading...</Text>
          ) : (
            <Text style={styles.data}>{carbs}</Text>
          )}
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionHead}>Details</Text>
        {loading ? (
          <Text style={styles.descriptionText}>Loading...</Text>
        ) : (
          <Text style={styles.descriptionText}> {description}</Text>
        )}
      </View>

      {/* Button */}
      {!loading && (
        <TouchableOpacity style={styles.button} onPress={handleAddToFavorites}>
          <Text style={styles.buttonText}>ADD TO DIET</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //  flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "#ffffff",
    height: "100%",
  },
  image: {
    marginTop: 50,
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#fff4ec",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  row: {
    flexDirection: "column",
    alignItems: "center",
  },
  heading: {
    color: "#ffBa89",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  data: {
    color: "#FF8437",
    fontSize: 22,
  },
  descriptionContainer: {
    //  backgroundColor: '#f0f0f0',
    padding: 20,
    marginBottom: 20,
  },
  descriptionHead: {
    textAlign: "left",
    fontSize: 26,
  },
  descriptionText: {
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#344B3F",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
