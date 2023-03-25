import { React, useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Button,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Buttons from "../buttons/Buttons";
import * as SecureStore from "expo-secure-store";
import { frontendUrl, tenantName } from "../config/config";
import ViewShot from "react-native-view-shot";

export default function QrCode() {
  var [codeGenerate, setCodeGenerate] = useState(false);

  var restaurantId = 2;
  // var restaurant = `restaurant/${restaurantId}`;
  // var restaurant = `192.168.1.35:3000/api/v1/ashoka/home`;

  var [tenant, setTenant] = useState("");

  useEffect(() => {
    getTenant();
  }, []);

  const getTenant = async () => {
    var user = await SecureStore.getItemAsync("userData");
    setTenant(JSON.parse(user).restaurant_name);
    // alert("data"+JSON.parse(user).restaurant_name);
    // alert(tenant)
  };

  var restaurant = `${frontendUrl}/menu-item`;

  // var erase = async() =>{
  //   await SecureStore.deleteItemAsync("token")
  //   await SecureStore.deleteItemAsync("userData")
  // }

  // const refs = useRef(null);
  // const viewShot = useRef(null);
  // var onSave = () => {
  //   viewShot.viewShot.capture().then((uri) => {
  //     Share.open({
  //       title: "QR Code",
  //       message: "message",
  //       url: uri,
  //     });
  //   });
  // };

  return (
    <>
      {/* <Text>Generate your QR code</Text> */}

      {/* <TouchableOpacity onPress={toggleDrawer}> */}
      {/*Donute Button Image */}
      <View style={styles.qrContainer}>
        <Image
          source={{
            uri: "https://media-cdn.tripadvisor.com/media/photo-s/19/77/44/d8/beautiful-interiors.jpg",
          }}
          // style={{ width: 100, height: 100, marginLeft: 5 }}
          style={styles.restaurantImg}
        />
        {/* </TouchableOpacity> */}

        <Text style={styles.tenantLable}>{tenant}</Text>

        {codeGenerate == false && (
          <View style={styles.barcodeBtn}>
            <Buttons
              generateMethod={setCodeGenerate}
              style={{ width: "70%", borderRadius: '10px' }}
            />
          </View>
        )}

        {/* <Button title='delete' onPress={erase}/> */}
        {/* <Button title="Download" style={styles.Tbutton} onPress={() => onSave()} /> */}

        {/* <ViewShot ref={viewShot} options={{ width: 100, height: 100, format: "jpg", quality: 1.0 }}> */}
        <View style={styles.barCode}>
          {codeGenerate > 0 && <QRCode value={restaurant} size={200} />}
        </View>
        {/* </ViewShot> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    backgroundColor: "white",
    height: "100%"
  },
  restaurantImg: {
    alignSelf: "center",
    width: "70%",
    height: "20%",
    // borderBottomLeftRadius: 10,
    borderRadius: 10,
    top: 30,
  },
  tenantLable: {
    alignSelf: 'center',
    top: 40,
    fontSize: 25,
  },
  barcodeBtn: {
    width: "70%",
    alignSelf: "center",
    borderRadius: "30px",
    top: 60,
  },
  barCode: {
    top: 100,
    alignSelf: 'center'
  }
});
