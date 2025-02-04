import { View, Text } from "react-native";
import React from "react";
import { ThemedText } from "../ThemedText";

const Text = ({
  children,
  ...otherProps
}: {
  children: React.ReactNode;
  lightColor?: string;
  darkColor?: string;
}) => {
  return (
    <ThemedText style={styles.text} {...otherProps}>
      {children}
    </ThemedText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
  },
});

export default Text;
