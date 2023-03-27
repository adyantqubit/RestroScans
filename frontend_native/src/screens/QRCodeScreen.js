import { React, useEffect, useState, useRef } from "react";
import { Text, View, Image, StyleSheet, Button } from "react-native";
import QRCode from "react-native-qrcode-svg";
import Buttons from "../buttons/Buttons";
import * as SecureStore from "expo-secure-store";
import config, { frontendUrl } from "../config/config";
import { getAppSetting } from "../api/Services";
// Added by Yuvraj Sahu on 26-3-2023
// Reason - to download the QR code
import ViewShot, { Share } from "react-native-view-shot";
// End of addition
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";

export default function QRCodeScreen() {
  var [codeGenerate, setCodeGenerate] = useState(false);
  const [appSettings, setAppSettings] = useState("");

  var [tenant, setTenant] = useState("");
  var [userData, setUserData] = useState([]);

  useEffect(() => {
    getTenant();
    getAppDetails();
  }, []);

  const getAppDetails = async () => {
    const response = await getAppSetting();
    setAppSettings(response);
  };

  const getTenant = async () => {
    var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
    var userData = await SecureStore.getItemAsync("userData");
    setTenant(JSON.parse(tenantInfo).tenant_name);
    setUserData(JSON.parse(userData));
  };

  var restaurant = `${frontendUrl}/api/v1/${tenant}/home`;

  // Added by Yuvraj Sahu on 26-3-2023
  // Reason - to download the QR code
  const view = useRef();
  var onSave = () => {
    // viewShot.current.capture().then((uri) => {
    // //   console.log("do something with ", uri);
    // //   Sharing.shareAsync("file://" + uri);
    // // })
    // Share.open({
    //   title: "QR Code",
    //   message: "message",
    //   url: uri,
    // });

    view.current.capture().then((uri) => {
      //

      console.log(uri);
    });
  };
  // End of addition

  return (
    <>
      <View style={styles.qrContainer}>
        <Text style={styles.tenantLable}>{userData.restaurant_name}</Text>

        {codeGenerate == false && (
          <View style={styles.barcodeBtn}>
            <Buttons
              generateMethod={setCodeGenerate}
              style={{ width: "70%", borderRadius: "10px" }}
            />
          </View>
        )}

        <ViewShot
          // ref={viewShot}
          // options={{ width: 100, height: 100, format: "jpg", quality: 1.0 }}
          ref={view}
          options={{ format: "jpg", quality: 0.9, fileName: "dewangan" }}
        >
          <View style={styles.barCode}>
            {codeGenerate > 0 && (
              <QRCode
                value={restaurant}
                logo={{ uri: config.imageUrl + appSettings.adyant_logo }}
                // logoSize={320}
                logoBackgroundColor={"white"}
                size={320}
              />
            )}
          </View>
        </ViewShot>
        {/* <Button title="Download" onPress={() => onSave()} /> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    flex: 1,
    backgroundColor: "white",
    height: "100%",
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
