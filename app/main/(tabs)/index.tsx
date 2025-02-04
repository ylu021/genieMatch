import { Animated, ImageBackground, StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import { PreferenceSearchBar } from "@/components/Preferences";
import { ProfileSwiper } from "@/components/ProfileSwiper";
import { SwipeIndicators } from "@/components/SwipeIndicators";
import Overlay from "@/components/Overlay";

const backgroundImage = require("@/assets/images/main-background3.png");

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
    <ImageBackground
      // source={backgroundImage}
      resizeMode="cover"
      style={styles.background}
    >
      <Overlay darkerOverlay />
      <View style={styles.container}>
        {/* <PreferenceSearchBar /> */}
        <ProfileSwiper
          // opacity={opacity}
          setUserSelection={setUserSelection}
          handleSwiped={handleSwiped}
        />
        <SwipeIndicators
          opacity={opacity}
          selection={selection}
          completed={completed}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
