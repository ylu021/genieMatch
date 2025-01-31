import React from "react";
import { Pressable, Animated, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

const IconWrapper = ({
  icon,
  scale,
  index,
}: {
  icon: { name: string; color: string };
  scale: Animated.Value;
  index: number;
}) => {
  const handlePressIn = (index: number) => {
    Animated.spring(scale, {
      toValue: 1.3,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = (index: number) => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  return (
    <Pressable
      onPressIn={() => handlePressIn(index)}
      onPressOut={() => handlePressOut(index)}
      style={styles.iconWrapper}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <AntDesign name={icon.name} size={40} color={icon.color} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    marginHorizontal: 25, // Add horizontal space between icons
  },
});

export default IconWrapper;
