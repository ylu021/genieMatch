import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const HeaderRight = ({}) => (
  <Pressable style={styles.container}>
    <FontAwesome name="magic" size={28} color={Colors.dark.greyColor} />
    <FontAwesome name="sliders" size={28} color={Colors.dark.greyColor} />
  </Pressable>
);

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 16,
  },
});

export default HeaderRight;
