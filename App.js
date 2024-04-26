import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Register from "./screens/Register";
import ProfileScreen from "./screens/Profile";
import CameraScreen from "./screens/Camera";
import ClickedScreen from "./screens/PhotoDetail";
import Blogs from "./screens/Blogs";
import BlogDetails from "./screens/BlogDetails";
import ChatScreen from "./screens/Chat";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();


const DrawerNavigator = () => (
  <Tab.Navigator initialRouteName="Home" labeled = {false}  >
    <Tab.Screen name="Nutrition Budget" component={Home} 
    options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}/>
    <Tab.Screen name="Chat" component={ChatScreen}
     options={{
      tabBarIcon: ({ color }) => (
        <MaterialCommunityIcons name="magnify" color={color} size={26} />
      ),
      title  : 'Chat',
      headerOptions:{
        til:'blue'
      },
      headerTitleAlign : 'center',
      headerShown : true,
      tabBarColor:'blue'
    }} />
    <Tab.Screen name="Camera" component={CameraScreen}  options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="camera" color={color} size={26} />
          ),
        }} />
    <Tab.Screen name="Blog" component={Blogs}  
    options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="file-document-outline" color={color} size={26} />
          ),
        }}/>
    <Tab.Screen name="Profile" component={ProfileScreen}  options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-outline" color={color} size={26} />
          ),
        }} />
  </Tab.Navigator>
);

const App = ({navigation,route}) => {


  // return (<NavigationContainer>
  //   {DrawerNavigator()}
  //   </NavigationContainer>)

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{ headerShown: true, headerTitleAlign:'left'}}
      >
        <Stack.Screen name="Main" component={DrawerNavigator} options={{ title: 'Nutrition Budget', headerTitleAlign:'center' }}  />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ClickedScreen" component={ClickedScreen} />
        <Stack.Screen name="BlogDetails" component={BlogDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

//options={{ title: 'Nutrition Budget', headerTitleAlign:'center' }} 

export default App;
