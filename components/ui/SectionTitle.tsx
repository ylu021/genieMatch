import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";

const SectionTitle = ({
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
    fontSize: 14,
    fontFamily: "OpenSans_700Bold",
    lineHeight: 20,
  },
});

export default SectionTitle;
