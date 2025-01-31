import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";

const AppHeaderText = ({
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
    fontSize: 46,
    marginTop: 10,
    fontFamily: "SourceSansPro_700Bold",
    lineHeight: 60,
  },
});

export default AppHeaderText;
