import { Href, Link } from "expo-router";
import React from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import GradientButton from "./GradientButton";

const Button = ({
  href,
  type = "primary",
  children,
  style,
  onPress,
  ...props
}: {
  href?: Href;
  type?: "primary" | "secondary";
  children: React.ReactNode;
  push?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}) => {
  if (type === "secondary") {
    const SecondaryButton = (
      <GradientButton style={styles.button} color="white" {...props}>
        {children}
      </GradientButton>
    );
    return href ? (
      <Link href={href} asChild>
        {SecondaryButton}
      </Link>
    ) : (
      SecondaryButton
    );
  }

  if (!href) {
    return (
      <Pressable
        style={[styles.button, styles.buttonPrimary, style]}
        onPress={onPress}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <Link
      href={href}
      asChild
      style={[styles.button, styles.buttonPrimary]}
      {...props}
    >
      <Pressable>{children}</Pressable>
    </Link>
  );
};

export const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    width: 263,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  buttonPrimary: {
    backgroundColor: "white",
  },
  buttonText: {
    fontFamily: "OpenSans_700Bold",
  },
});

export default Button;
