import React from "react";
import { Button, StyleSheet } from "react-native";

export default function Buttons(props) {

    const handleOpen = () =>{
        props.generateMethod(true)
    }

  return (
    <>
      <Button
        onPress={handleOpen}
        // style={styles.btn}
        title="GENERATE BARCODE"
        // title={`jhjhjr`}
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </>
  );
}

const styles = StyleSheet.create({
    btn: {
      color: "#841584"
    }
  });