import { StatusBar } from "react-native";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import AuthNavigation from "./src/navigation/AuthNavigation";
import { AppStateProvider } from "./src/context/AppStateProvider";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <AppStateProvider>
      <AuthNavigation />
      </AppStateProvider>
    </SafeAreaView>
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
