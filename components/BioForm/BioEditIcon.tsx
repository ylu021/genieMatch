import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const BioEditIcon = ({
  setEditMode,
}: {
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <TouchableOpacity
      style={styles.default}
      onPress={() => setEditMode((prev) => !prev)}
      activeOpacity={0.8}
    >
      <AntDesign name="edit" size={25} color={Colors.dark.tint} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  editIcons: {
    flexDirection: "row",
    columnGap: 10,
  },
  default: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default BioEditIcon;
