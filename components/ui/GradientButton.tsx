import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Href } from "expo-router";

const GradientButton = ({
  style,
  color,
  children,
  ...props
}: {
  style?: StyleProp<ViewStyle>;
  color: string;
  children: React.ReactNode;
}) => {
  return (
    <Pressable {...props}>
      <LinearGradient colors={["#FF9509", "#FE2042"]} style={style}>
        {children}
      </LinearGradient>
    </Pressable>
  );
};

export default GradientButton;
