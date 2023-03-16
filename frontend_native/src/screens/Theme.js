import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    Pressable,
    Button,
  } from "react-native";
import { ColorPicker,TriangleColorPicker } from 'react-native-color-picker'

export default function Theme() {
    const Bgapply = () => {
        // navigation.navigate("forgotPassword");
      };

  return (
    <>
    <View
      style={[
        styles.container,
        {
          // Try setting `flexDirection` to `"row"`.
          flexDirection: 'column',
        },
      ]}>
      {/* <View style={{flex: 1, backgroundColor: 'red'}} />
      <View style={{flex: 2, backgroundColor: 'darkorange'}} />
      <View style={{flex: 3, backgroundColor: 'green'}} /> */}
    </View>
    <TriangleColorPicker
      onColorSelected={color => alert(`Color selected: ${color}`)}
      style={{flex: 1}}
    //   hideSliders={true}
    />
    <TriangleColorPicker
      onColorSelected={color => alert(`Color selected: ${color}`)}
      style={{flex: 1}}
    //   hideSliders={true}
    />
    <TriangleColorPicker
      onColorSelected={color => alert(`Color selected: ${color}`)}
      style={{flex: 1}}
    //   hideSliders={true}
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
                    color:  "white",
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
