import { React, useEffect, useState } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import Buttons from "../buttons/Buttons";
import * as SecureStore from "expo-secure-store";
import config, { frontendUrl } from "../config/config";
import { getAppSetting } from "../api/Services";

export default function QRCodeScreen() {
  var [codeGenerate, setCodeGenerate] = useState(false);
  const [appSettings,setAppSettings]=useState("")

  var [tenant, setTenant] = useState("");
  var [userData, setUserData] = useState([]);

  useEffect(() => {
    getTenant();
    getAppDetails();
  }, []);

  const getAppDetails =async ()=>{
    const response = await getAppSetting();
    setAppSettings(response)
  }

  const getTenant = async () => {
    var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
    var userData = await SecureStore.getItemAsync("userData");
    setTenant(JSON.parse(tenantInfo).tenant_name);
    setUserData(JSON.parse(userData))
  };

  var restaurant = `${frontendUrl}/api/v1/${tenant}/home`;

  return (
    <>
      <View style={styles.qrContainer}>
        {/* <Image
          source={{
            uri: "https://media-cdn.tripadvisor.com/media/photo-s/19/77/44/d8/beautiful-interiors.jpg",
          }}
          style={styles.restaurantImg}
        /> */}
        <Text style={styles.tenantLable}>{userData.restaurant_name}</Text>

        {codeGenerate == false && (
          <View style={styles.barcodeBtn}>
            <Buttons
              generateMethod={setCodeGenerate}
              style={{ width: "70%", borderRadius: "10px" }}
            />
          </View>
        )}

        <View style={styles.barCode}>
          {codeGenerate > 0 && <QRCode value={restaurant} 
          logo={{uri: config.imageUrl+appSettings.adyant_logo}} 
          // logoSize={320}
          logoBackgroundColor={"white"}
          size={320} />}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    flex:1,
    backgroundColor: "white",
    height: "100%",
  },
  restaurantImg: {
    alignSelf: "center",
    width: "70%",
    height: "20%",
    borderRadius: 10,
    top: 20,
  },
  tenantLable: {
    alignSelf: "center",
    top: 20,
    fontSize: 25,
  },
  barcodeBtn: {
    width: "70%",
    alignSelf: "center",
    borderRadius: "30px",
    top: 20,
  },
  barCode: {
    top: 60,
    alignSelf: "center",
  },
});
