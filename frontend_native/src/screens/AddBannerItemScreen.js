// Created by Om on 08-04-2023
// Reason - to design tabs for banner and category

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AddBanner from '../components/AddBanner';
import AddBannerItems from '../components/AddBannerItems';
const Tab = createMaterialTopTabNavigator();

export function AddBannerItemScreen() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Banner/Offer" component={AddBanner} />
        <Tab.Screen name="Banner/Offer-items" component={AddBannerItems} />
      </Tab.Navigator>
    );
  }