import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";

const AppHeaderText = ({ children }: { children: React.ReactNode }) => {
  return <ThemedText style={styles.text}>{children}</ThemedText>;
};

const styles = StyleSheet.create({
  text: { fontSize: 20, marginTop: 10, color: "black" },
});

export default AppHeaderText;
