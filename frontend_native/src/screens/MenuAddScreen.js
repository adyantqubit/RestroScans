// Created by Yuvraj Sahu on 24-3-2023
// Reason - to design tabs for adding menu. categpory and item

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { NavigationContainer } from '@react-navigation/native';
import AddItems from './AddItems';
import AddMenu from './AddMenu';
import Category from './Category';
const Tab = createMaterialTopTabNavigator();

export function MenuAddScreen() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Menu" component={AddMenu} />
        <Tab.Screen name="Category" component={Category} />
        <Tab.Screen name="Item" component={AddItems} />
      </Tab.Navigator>
    );
  }