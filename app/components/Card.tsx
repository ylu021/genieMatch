import { View, StyleSheet } from "react-native";
import React from "react";

const Card = ({ children }: { children: React.ReactNode }) => {
  return <View style={[styles.card]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    height: 400,
    backgroundColor: "white",
    borderWidth: 1, // Border width
    borderRadius: 10,
    marginTop: 200,
  },
});

export default Card;
