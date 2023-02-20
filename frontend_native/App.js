import { StatusBar } from "react-native";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./src/screens/Home";
import Category from "./src/screens/Category";
import List from "./src/screens/List";
import PreviewMenu from "./src/screens/PreviewMenu";
import AddItems from "./src/screens/AddItems";
import Offer from "./src/screens/Offer";
import QrCode from "./src/screens/QrCode";
import AuthNavigation from "./src/navigation/AuthNavigation";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";

export default function App() {
  const Drawer = createDrawerNavigator();

  const BASE_PATH =
    "https://raw.githubusercontent.com/AboutReact/sampleresource/master/";
  const proileImage = "react_logo.png";

  return (
   <Provider store={store}>
     <SafeAreaView style={{ flex: 1 }}>
      {/* <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen
            name="Home"
            component={Home}
            options={{ drawerLabel: "Home" }}
          />
          <Drawer.Screen
            name="Add"
            component={Category}
            options={{ drawerLabel: "Add" }}
          />
          <Drawer.Screen
            name="Menu List"
            component={List}
            options={{ drawerLabel: "Menu List" }}
          />
          <Drawer.Screen
            name="Preview Preview"
            component={PreviewMenu}
            options={{ drawerLabel: "Preview Menu" }}
          />
          <Drawer.Screen
            name="Generate QR Code"
            component={QrCode}
            options={{ drawerLabel: "Generate QR Code" }}
          />
          
          <Drawer.Screen
            name="Offers"
            component={Offer}
            options={{ drawerLabel: "All offers" }}
          />
        </Drawer.Navigator>
      </NavigationContainer> */}
      <AuthNavigation />
    </SafeAreaView>
   </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
