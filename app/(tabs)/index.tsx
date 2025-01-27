import React, { useState } from "react";
import {
  Text,
  Animated,
  StyleSheet,
  View,
  useAnimatedValue,
} from "react-native";
import { PreferenceSearchBar } from "../components/Preferences";
import { ProfileSwiper } from "../components/ProfileSwiper";
import { SwipeIndicators } from "../components/SwipeIndicators";

export default function HomeScreen() {
  const opacity = useAnimatedValue(0);
  const textOpacity = useAnimatedValue(0);
  const [selection, setUserSelection] = useState(0);
  const [completed, setCompleted] = useState(false);
  // const score = sharedInterests.length / totalInterests.length;
  // const animCardOpacity = Animated.timing(opacity, {
  //   toValue: 0,
  //   duration: 300,
  //   useNativeDriver: true,
  //   onEnd: () => {
  //     console.log("animCardOpacity finished!");
  //     setTextVisible(true); // Show the message after card opacity is done
  //   },
  // });

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
