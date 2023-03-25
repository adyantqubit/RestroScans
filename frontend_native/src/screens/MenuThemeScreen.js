import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { ColorPicker, TriangleColorPicker } from "react-native-color-picker";

export default function MenuThemeScreen() {
  const Bgapply = () => {};

  return (
    <>
      <View
        style={[
          styles.container,
          {
            flexDirection: "column",
          },
        ]}
      ></View>
      <TriangleColorPicker
        onColorSelected={(color) => alert(`Color selected: ${color}`)}
        style={{ flex: 1 }}
      />
      <TriangleColorPicker
        onColorSelected={(color) => alert(`Color selected: ${color}`)}
        style={{ flex: 1 }}
      />
      <TriangleColorPicker
        onColorSelected={(color) => alert(`Color selected: ${color}`)}
        style={{ flex: 1 }}
      />
      <Pressable
        onPress={Bgapply}
        style={{
          backgroundColor: "#003366",
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 3,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Applyuur
        </Text>
      </Pressable>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
