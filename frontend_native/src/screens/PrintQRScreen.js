
// Guided by Ashish sir on 11-04-23
import React, { useState, useEffect,} from "react";
import { View, Text,  ScrollView,StyleSheet,Pressable
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { colors, fonts } from "../Colours/globalColor";
import { SvgCssUri } from 'react-native-svg';
import Icon from "react-native-vector-icons/AntDesign";
import * as SecureStore from "expo-secure-store";
import * as Print from 'expo-print'
import Footer from "../components/Footer/Footer";

  export default function PrintQRScreen({ navigation, route }) {
    const isFocused = useIsFocused();
    var [userData, setUserData] = useState([]);
    var [scanner, setScanner] = useState(""); 

    useEffect(() => {
        authNavigate();
        getQRCode();
    }, [isFocused]);

    const getQRCode = async () => {
        var qrCode = await SecureStore.getItemAsync("qrCodeTenant");
        setScanner(qrCode);
      };
    var authNavigate = async () => {
        if ((await SecureStore.getItemAsync("userData")) == null) {
          navigation.navigate("LoginScreen");
        }
        if ((await SecureStore.getItemAsync("userData")) != null) {
          setUserData(JSON.parse(await SecureStore.getItemAsync("userData")));
        }
      };
      const html = `
      <html >
       
        <body style="text-align: center;margin:0px;padding:0px;">
        <div style="display:flex;flex-wrap:wrap;">
        <div style="width:50vw; height:50vh;">
        <div style="font-size: 30px; font-family: Helvetica Neue; font-weight: bold; text-transform:uppercase">
        ${userData.restaurant_name}
      </div>
          <img
            src=http://192.168.1.10:8000/media/ashoka.moreshop.co.in/images/qrcode/qr.svg 
            //  src=${scanner}
            style="width: 330px;height:330px; margin-top:-20px; margin-bottom:-20px;" />
            <div>
            <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
            Adyant Softtech Pvt. Ltd., Raipur
          </h1>
          <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
        <img src = '${'http://192.168.1.10:19000/assets/globe.png'}' width='14px' height='14px'/>
         www.restroscans.com
      </h1>
          <h1 style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
          <b>  Scan menu</b>
        </h1>
        
        <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
        Table no :
      </h1>
      </div>
      </div>
      
      
      <div style="width:50vw; height:50vh;">
        <div style="font-size: 30px; font-family: Helvetica Neue; font-weight: bold;text-transform:uppercase"">
        ${userData.restaurant_name}
      </div>
          <img
            src=http://192.168.1.10:8000/media/ashoka.moreshop.co.in/images/qrcode/qr.svg 
            //  src=${scanner}
            style="width: 330px;height:330px;margin-top:-20px; margin-bottom:-20px;" />
            <div>
            <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
            Adyant Softtech Pvt. Ltd., Raipur
          </h1>
          <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
        <img src = '${'http://192.168.1.10:19000/assets/globe.png'}' width='14px' height='14px'/>
         www.restroscans.com
      </h1>
          <h1 style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
          <b>  Scan menu</b>
        </h1>
        
        <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
        Table no :
      </h1>
      </div>
      </div>
      
      <div style="width:50vw; height:50vh;">
        <div style="font-size: 30px; font-family: Helvetica Neue; font-weight: bold;text-transform:uppercase"">
        ${userData.restaurant_name}
      </div>
          <img
            src=http://192.168.1.10:8000/media/ashoka.moreshop.co.in/images/qrcode/qr.svg 
            //  src=${scanner}
            style="width: 330px;height:330px; margin-top:-20px; margin-bottom:-20px;" />
            <div>
            <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
            Adyant Softtech Pvt. Ltd., Raipur
          </h1>
          <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
        <img src = '${'http://192.168.1.10:19000/assets/globe.png'}' width='14px' height='14px'/>
         www.restroscans.com
      </h1>
          <h1 style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
          <b>  Scan menu</b>
        </h1>
        
        <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
        Table no :
      </h1>
      </div>
      </div>
      
      <div style="width:50vw; height:50vh;">
        <div style="font-size: 30px; font-family: Helvetica Neue; font-weight: bold;text-transform:uppercase"">
        ${userData.restaurant_name}
      </div>
          <img
            src=http://192.168.1.10:8000/media/ashoka.moreshop.co.in/images/qrcode/qr.svg 
            //  src=${scanner}
            style="width: 330px;height:330px; margin-top:-20px; margin-bottom:-20px;" />
            <div>
            <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
            Adyant Softtech Pvt. Ltd., Raipur
          </h1>
          <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
        <img src = '${'http://192.168.1.10:19000/assets/globe.png'}' width='14px' height='14px'/>
         www.restroscans.com
      </h1>
          <h1 style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
        <b>  Scan menu</b>
        </h1>
        
        <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
        Table no :
      </h1>
      </div>
      </div>
      
      </div>
        </body>
      </html>
      `;
      const printDoc = async () => {
        await Print.printAsync({
          html,
        });
      };

    return (
        <>
      <ScrollView style={styles.homeContainer}>
      <View style={styles.restaurantDetail}>
          <Text style={styles.restaurantLable}>{userData.restaurant_name}</Text>
        </View>
      <View style={{
          alignItems: "center",
          justifyContent: "center",
          alignSelf: 'center',
          paddingBottom: 10,
          width: "100%",
        }}>

          <SvgCssUri
            width="180"
            height="180"
            viewBox="0 0 450 470"
            uri="http://192.168.1.10:8000/media/ashoka.moreshop.co.in/images/qrcode/qr.svg"
          // uri={scanner}
          />
          <View style={{
            // marginTop: -10,
            // marginTop: -2,
             alignItems: "center",
            justifyContent: "center",
            alignSelf: 'center',
            // marginLeft:10
          }}>
            <Text style={{ fontSize: 10, }}>Adyant Softtech Pvt. Ltd., Raipur</Text>
            <Text style={{ fontSize: 10, }}>
              <Icon name="earth" size={12} color="black" />
              &nbsp;www.restroscans.com </Text>
            <Text style={{ fontSize: 12,fontWeight:'bold' }}>Scan menu </Text>
            <Text style={{ fontSize: 10, }}>
              Table no: </Text>
          </View>
        </View>
        <View style={styles.btns}
        >
          <Pressable
            onPress={printDoc}
            style={{
              backgroundColor: colors.btnColor,
              height: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 7,
              width: 60
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              Print
            </Text>
          </Pressable>

        </View>
      </ScrollView>
      <>
      <Footer />
      </>
      </>
    );
  }
  const styles = StyleSheet.create({
    homeContainer: {
      backgroundColor: "#edebeb",
      margin: "auto",
      height: "100%",
      display: "flex",
      paddingTop:190
    },
    restaurantDetail: {
      alignSelf: "center",
      alignItems: "center",
    },
    restaurantLable: {
      fontSize: fonts.title1,
      fontWeight: 'bold',
      textTransform:'uppercase',
    //   marginLeft:18
    },
    btns: {
      alignSelf: "center",
      fontSize: 3,
      flexDirection: 'row',
    },
    
  });