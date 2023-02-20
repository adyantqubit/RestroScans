import { React, useState } from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import Buttons from "../buttons/Buttons";

export default function QrCode() {

  var [codeGenerate, setCodeGenerate] = useState(false)

  var restaurantId = 2;
  var restaurant = `restaurant/${restaurantId}`;

  return (
    <>
      <Text>Generate your QR code</Text>

      {/* <TouchableOpacity onPress={toggleDrawer}> */}
        {/*Donute Button Image */}
        <Image
          source={{
            uri:
              'https://media-cdn.tripadvisor.com/media/photo-s/19/77/44/d8/beautiful-interiors.jpg',
          }}
          // style={{ width: 100, height: 100, marginLeft: 5 }}
          style={styles.restaurantImg}
        />
      {/* </TouchableOpacity> */}

      <Buttons generateMethod={setCodeGenerate} />

      <View style={{ marginTop: 30, alignSelf: "center" }}>
          {codeGenerate > 0 && <QRCode value={restaurant} size={200} />}
        </View>
    </>
  );
}


const styles = StyleSheet.create({
  restaurantImg : {
    alignSelf: 'center',
    width: '80%',
    height: '20%',
    // borderBottomLeftRadius: 10,
    borderRadius: 10,
  }
})