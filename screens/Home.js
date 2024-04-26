import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Circle from "./Circle";
// import Svg, { Circle, Rect } from 'react-native-svg';
import Constants from "expo-constants";
import axios from "axios";
import CircularProgress from "react-native-circular-progress-indicator";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const Home = () => {
  const { API_KEY } = Constants.expoConfig.extra;
  const [suggestion1, setSuggestion1] = useState("");
  const [suggestion2, setSuggestion2] = useState("");
  const [suggestion3, setSuggestion3] = useState("");
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const navigation = useNavigation();
  const [data, setData] = useState();

  useEffect(() => {
    checkAuth(); // Check authentication on component mount
    getsuggestion(); // Fetch suggestions on component mount
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const StringuserData = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(StringuserData);
      if (userData && userData.token && userData.token.length > 0) {
        const response = await axios.get(
          `https://nutrinode.vercel.app/user/get-diet`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );
        const allData = response.data.diet.items;

        // Initialize variables to store nutrient sums
        let totalCarbs = 0;
        let totalCalories = 0;
        let totalFats = 0;
        let totalProtein = 0;

        // Loop through each object in the array
        for (const item of allData) {
          // Extract nutrient values and convert them to numbers (handling potential errors)
          totalCarbs += parseFloat(item.carbs || 0);
          totalCalories += parseFloat(item.calories || 0);
          totalFats += parseFloat(item.fat || 0);
          totalProtein += parseFloat(item.protein || 0);
        }

        // Update state with calculated nutrient sums (assuming you have a state variable)
        setData({
          ...data,
          totalCarbs,
          totalCalories,
          totalFats,
          totalProtein,
        });
      } else {
        navigation.navigate("Login"); // Navigate to Login if token is not found
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkAuth = async () => {
    try {
      const StringuserData = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(StringuserData);
      if (!userData || !userData.token || userData.token.length === 0) {
        navigation.navigate("Login"); // Navigate to Login if token is not found
      }
    } catch (error) {
      console.log("Error checking authentication:", error);
    }
  };
  const getsuggestion = async () => {
    setIsGeneratingResponse(true);
    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4-turbo",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Generate three food health related suggestions in the given format of json {suggestion1:'',suggestion2:'',suggestion3:''} , dont generate anythone other comment or anything else ",
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
      setSuggestion1(
        JSON.parse(res.data.choices[0].message.content).suggestion1
      );
      setSuggestion2(
        JSON.parse(res.data.choices[0].message.content).suggestion2
      );
      setSuggestion3(
        JSON.parse(res.data.choices[0].message.content).suggestion3
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleHeader}>Macros</Text>

      {/* Black container */}
      <View style={[styles.blackContainer]}>
        <View style={styles.circleRow}>
          {data && data.totalCarbs && (
            <View style={styles.circleWithText}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Text
                  style={[
                    styles.circleText,
                    { color: "#25B4A4", fontWeight: "bold", fontSize: 14 },
                  ]}
                >
                  Carb
                </Text>
                <CircularProgress
                  value={data.totalCarbs}
                  radius={50}
                  duration={1000}
                  progressValueColor={"black"}
                  maxValue={265}
                  title={"/265g"}
                  titleColor={"black"}
                  titleStyle={{ fontWeight: "normal" }}
                  activeStrokeColor={"#26B4A4"}
                />
              </View>
            </View>
          )}
          {data && data.totalCalories && (
            <View style={styles.circleWithText}>
              <Text
                style={[
                  styles.circleText,
                  { color: "#0A1B57", fontWeight: "bold", fontSize: 14 },
                ]}
              >
                Calories
              </Text>
              <CircularProgress
                value={data.totalCalories}
                radius={50}
                duration={1000}
                progressValueColor={"black"}
                maxValue={2750}
                title={"/2750g"}
                titleColor={"black"}
                titleStyle={{ fontWeight: "normal" }}
                activeStrokeColor={"#0A1B57"}
              />
            </View>
          )}
        </View>
        <View style={styles.circleRow}>
          {data && data.totalFats && (
            <View style={styles.circleWithText}>
              <Text
                style={[
                  styles.circleText,
                  { color: "#20970D", fontWeight: "bold", fontSize: 14 },
                ]}
              >
                Fat
              </Text>
              <CircularProgress
                value={data.totalFats}
                radius={50}
                duration={1000}
                progressValueColor={"black"}
                maxValue={35}
                title={"/35g"}
                titleColor={"black"}
                titleStyle={{ fontWeight: "normal" }}
                activeStrokeColor={"#20970D"}
              />
            </View>
          )}

          {data && data.totalProtein && (
            <View style={styles.circleWithText}>
              <Text
                style={[
                  styles.circleText,
                  { color: "#D6A251", fontWeight: "bold", fontSize: 14 },
                ]}
              >
                Protien
              </Text>

              <CircularProgress
                value={data.totalProtein}
                radius={50}
                duration={1000}
                progressValueColor={"black"}
                maxValue={65}
                title={"/65g"}
                titleColor={"black"}
                titleStyle={{ fontWeight: "normal" }}
                activeStrokeColor={"#D7A251"}
              />
            </View>
          )}
        </View>
      </View>

      {/* Blue container */}
      <View style={[styles.blueContainer, { borderWidth: 0, borderRadius: 0 }]}>
        {/* Heading */}
        <Text style={styles.titleHeader}>Suggestions</Text>
        {/* Subsections */}
        <View style={styles.subContainer}>
          <View style={[styles.subSection, { flex: 3 }]}>
            <Text
              style={[
                styles.priority,
                { backgroundColor: "#CD4F41", padding: 20 },
              ]}
            >
              Priority
            </Text>
          </View>
          <View style={[styles.subSection, { flex: 7 }]}>
            <View style={{ justifyContent: "flex-start", paddingLeft: 10 }}>
              <Text
                style={[
                  styles.suggestion,
                  { fontWeight: "bold", fontWeight: "bold", fontSize: 12 },
                ]}
              >
                Focus on mineral
              </Text>
            </View>
            <View style={{ justifyContent: "flex-start", paddingLeft: 10 }}>
              <Text style={styles.suggestion}>
                {isGeneratingResponse ? "Generating..." : suggestion1}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.subContainer}>
          <View style={[styles.subSection, { flex: 3 }]}>
            <Text
              style={[
                styles.priority,
                { backgroundColor: "#1C404C", padding: 20 },
              ]}
            >
              Medium
            </Text>
          </View>
          <View style={[styles.subSection, { flex: 7 }]}>
            <View style={{ justifyContent: "flex-start", paddingLeft: 10 }}>
              <Text
                style={[
                  styles.suggestion,
                  {
                    fontWeight: "bold",
                    fontWeight: "bold",
                    fontSize: 12,
                    textAlign: "left",
                  },
                ]}
              >
                Focus on vitamin and water
              </Text>
            </View>
            <View style={{ justifyContent: "flex-start", paddingLeft: 10 }}>
              <Text style={styles.suggestion}>
                {isGeneratingResponse ? "Generating..." : suggestion2}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.subContainer}>
          <View style={[styles.subSection, { flex: 3 }]}>
            <Text
              style={[
                styles.priority,
                { backgroundColor: "#2D8078", padding: 20 },
              ]}
            >
              Low
            </Text>
          </View>
          <View style={[styles.subSection, { flex: 7 }]}>
            <View style={{ justifyContent: "flex-start", paddingLeft: 10 }}>
              <Text
                style={[
                  styles.suggestion,
                  { fontWeight: "bold", fontWeight: "bold", fontSize: 12 },
                ]}
              >
                Focus on others
              </Text>
            </View>
            <View style={{ justifyContent: "flex-start", paddingLeft: 10 }}>
              <Text style={styles.suggestion}>
                {isGeneratingResponse ? "Generating..." : suggestion3}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
    backgroundColor: "white",
    paddingTop: 0,
  },
  blackContainer: {
    flex: 3,
    backgroundColor: "#EEEEEE",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    blurRadius: 19,
  },
  blueContainer: {
    flex: 3,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
    paddingTop: 10,
  },

  circleRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 10,
  },
  circleWithText: {
    alignItems: "center",
    paddingTop: 5,
  },
  circleText: {
    fontSize: 16,
    paddingBottom: 5,
  },
  heading: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 15,
  },
  subContainer: {
    flexDirection: "row",
    marginBottom: 14,
  },
  subSection: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingRight: 10,
  },
  priority: {
    fontSize: 18,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    width: 110,
    textAlign: "center",
  },
  subHeading: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  suggestion: {
    fontSize: 10,
    marginBottom: 5,
    paddingLeft: 10,
  },

  titleHeader: {
    color: "#000000",
    fontSize: 15,
    fontFamily: "Merriweather",
    fontWeight: "bold",
    fontStyle: "normal",
    marginBottom: 10,
  },

  rectangle: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
