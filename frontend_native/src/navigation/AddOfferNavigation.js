// Created by Om on 08-04-2023
// Reason - to design tabs for banner and category

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AddOfferScreen from '../screens/offer/AddOfferScreen';
import AddOfferItemScreen from '../screens/offer/AddOfferItemScreen';
const Tab = createMaterialTopTabNavigator();

export function AddOfferNavigation() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Banner/Offer" component={AddOfferScreen} />
        <Tab.Screen name="Banner/Offer-items" component={AddOfferItemScreen} />
      </Tab.Navigator>
    );
  }