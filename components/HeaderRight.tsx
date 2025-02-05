import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
  Button,
} from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { RelativePathString, useRouter } from "expo-router";

const HeaderRight = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push("/")}>
        <FontAwesome name="magic" size={28} color={Colors.dark.greyColor} />
      </Pressable>
      <Pressable
        onPress={() => router.push("/preferences" as RelativePathString)}
      >
        <FontAwesome name="sliders" size={28} color={Colors.dark.greyColor} />
      </Pressable>
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 16,
    marginRight: 5,
  },
});

export default HeaderRight;
