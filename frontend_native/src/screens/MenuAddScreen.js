// Created by Yuvraj Sahu on 24-3-2023
// Reason - to design tabs for adding menu. categpory and item

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { NavigationContainer } from '@react-navigation/native';
import AddItem from '../components/AddItem';
import AddMenu from '../components/AddMenu';
import AddCategory from '../components/AddCategory';
const Tab = createMaterialTopTabNavigator();

export function MenuAddScreen() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Menu" component={AddMenu} />
        <Tab.Screen name="Category" component={AddCategory} />
        <Tab.Screen name="Item" component={AddItem} />
      </Tab.Navigator>
    );
  }