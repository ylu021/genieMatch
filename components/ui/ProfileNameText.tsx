import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";

const ProfileNameText = ({
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
    fontSize: 34,
    fontFamily: "SourceSansPro_700Bold",
    lineHeight: 44,
  },
});

export default ProfileNameText;
