import { View, Text, StyleSheet } from "react-native";
import React from "react";

const AppHeaderText = ({ children }: { children: React.ReactNode }) => {
  return <Text style={styles.text}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: { fontSize: 20, marginTop: 10 },
});

export default AppHeaderText;
