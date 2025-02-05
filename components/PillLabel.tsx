import React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "./ThemedText";

const PillLabel = ({
  text,
  bgColor,
  fat,
  outline,
  onPress,
}: {
  text: React.ReactNode;
  bgColor?: string;
  outline?: string;
  fat?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.pill,
        fat ? styles.fatPill : undefined,
        { borderColor: outline ? outline : "none" },
        { backgroundColor: bgColor ? bgColor : "rgba(255,255,255, 0.25)" },
      ]}
      onPress={onPress}
    >
      <ThemedText style={styles.pillText}>{text}</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    borderRadius: 20,
    paddingHorizontal: 16,
    alignSelf: "center",
  },
  fatPill: {
    paddingVertical: 4,
  },
  pillText: {
    color: "white",
  },
});

export default PillLabel;
