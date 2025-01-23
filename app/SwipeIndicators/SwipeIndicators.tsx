import React from "react";
import { Text, Animated, Dimensions, StyleSheet } from "react-native";

// Animated NOPE Message
export default function SwipeIndicators({
  opacity,
  selection,
}: {
  opacity: Animated.Value;
  selection: number;
}) {
  return (
    <>
      <Animated.View style={[styles.nopeContainer, { opacity }]}>
        {selection === -1 && <Text style={styles.nopeText}>NOPE</Text>}
        {selection === 2 && <Text style={styles.nopeText}>LOVE</Text>}
        {selection === 1 && <Text style={styles.nopeText}>LIKE</Text>}
      </Animated.View>
    </>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  nopeContainer: {
    position: "absolute",
    top: "75%",
    left: screenWidth * 0.5 - 5,
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 10,
  },
  nopeText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "red",
  },
});
