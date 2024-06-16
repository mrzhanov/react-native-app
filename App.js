import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import HomeScreen from './screens/HomeScreen';
import Scanner from './screens/Scanner';
import AddProduct from './screens/AddProduct';
import Search from './screens/Search';
import Login from './screens/Login';
import Register from './screens/Register';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native';
import { auth, db } from './services/firebase.service';
import { collection, getDocs } from 'firebase/firestore';
import { exitSound, playStartSound } from './constants/constants';


const Stack = createStackNavigator();
export default function App() {
 

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Home'}>
      <Stack.Screen  name="Home" component={HomeScreen}/>
        <Stack.Screen name="Scanner" component={Scanner} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
