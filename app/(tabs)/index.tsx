import React, { useState } from "react";
import { StyleSheet, View, useAnimatedValue } from "react-native";
import { PreferenceSearchBar } from "../Preferences";
import { SwipeIndicators } from "../SwipeIndicators";
import { ProfileSwiper } from "../ProfileSwiper";

export default function HomeScreen() {
  const opacity = useAnimatedValue(0);
  const [selection, setUserSelection] = useState(0);
  // const score = sharedInterests.length / totalInterests.length;

  return (
    <View style={styles.container}>
      <PreferenceSearchBar />
      <ProfileSwiper opacity={opacity} setUserSelection={setUserSelection} />
      <SwipeIndicators opacity={opacity} selection={selection} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1, // Border width
    borderColor: "blue",
  },
});
