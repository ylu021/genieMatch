import { Animated, StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import { PreferenceSearchBar } from "@/components/Preferences";
import { ProfileSwiper } from "@/components/ProfileSwiper";
import { SwipeIndicators } from "@/components/SwipeIndicators";

export default function Main() {
  const opacity = useRef(new Animated.Value(0)).current;
  const [selection, setUserSelection] = useState(0);
  const [completed, setCompleted] = useState(false);
  // const score = sharedInterests.length / totalInterests.length;

  const fadeIn = (animatedVal: Animated.Value, duration = 100) =>
    Animated.timing(animatedVal, {
      toValue: 1,
      delay: 0,
      duration,
      useNativeDriver: true,
    });

  const fadeOut = (animatedVal: Animated.Value, duration = 100) =>
    Animated.timing(animatedVal, {
      toValue: 0,
      delay: 0,
      duration,
      useNativeDriver: true,
    });

  const animCardOpacity = Animated.sequence([
    fadeIn(opacity),
    fadeOut(opacity, 300),
  ]);

  const handleSwiped = () => {
    animCardOpacity.start();
  };

  return (
    <View style={styles.container}>
      <PreferenceSearchBar />
      <ProfileSwiper
        opacity={opacity}
        setUserSelection={setUserSelection}
        handleSwiped={handleSwiped}
      />
      <SwipeIndicators
        opacity={opacity}
        selection={selection}
        completed={completed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
