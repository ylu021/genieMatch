import { Href, Link } from "expo-router";
import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import GradientButton from "./GradientButton";

const Button = ({
  href,
  type = "primary",
  children,
  ...props
}: {
  href: Href;
  type?: "primary" | "secondary";
  children: React.ReactNode;
  push?: boolean;
}) => {
  if (type === "secondary") {
    return (
      <Link href={href} asChild>
        <GradientButton style={styles.button} color="white" {...props}>
          {children}
        </GradientButton>
      </Link>
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
