
import React from "react";
import { View, Text,TouchableOpacity } from "react-native";

  export default function PreviewMenuScreen() {
  
    return (
      <View >
         <View
                style={{ backgroundColor: '#003366', display: "flex", flexDirection: "row", justifyContent: 'center', flexWrap: 'wrap', }}
            >
                <TouchableOpacity onPress={() => Linking.openURL('https://adyant.co.in/')}>
                    <Text style={{ color: 'white' }}>
                        Adyant Powered © 2023
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
  }