import React, { useState } from "react";
import { View, Animated, TouchableOpacity } from "react-native";

const animations = () => {
  const value = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];
  const moveBall = () => {
    Animated.timing(value, {
      toValue: { x: 100, y: 100 },
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  return (
    <View>
      <Animated.View>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 100 / 2,
            backgroundColor: "red",
          }}
        />
      </Animated.View>
      <TouchableOpacity onPress={moveBall} />
    </View>
  );
};

export default animations;
