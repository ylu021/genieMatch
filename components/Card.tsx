import { View, StyleSheet, Dimensions } from "react-native";
import React from "react";

const Card = ({ children }: { children: React.ReactNode }) => {
  return <View style={[styles.card]}>{children}</View>;
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  card: {
    width: screenWidth - 10,
    justifyContent: "center",
    alignSelf: "center",
    height: 580,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default Card;
