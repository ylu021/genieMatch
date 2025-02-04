import React, { forwardRef } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GradientButtonProps {
  style?: StyleProp<ViewStyle>;
  color: string;
  children: React.ReactNode;
}

const GradientButton = forwardRef(
  (props: GradientButtonProps, ref, ...rest) => {
    return (
      <Pressable {...rest}>
        <LinearGradient colors={["#FF9509", "#FE2042"]} style={props.style}>
          {props.children}
        </LinearGradient>
      </Pressable>
    );
  }
);

export default GradientButton;
