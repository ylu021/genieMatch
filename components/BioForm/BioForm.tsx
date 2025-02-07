import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { BioFormCategory, BioFormType } from "@/types/bioForm";
import { ThemedText } from "../ThemedText";

const BioForm = ({
  formValue = "",
  updateFormChange,
  type,
  editMode,
}: {
  formValue: string | undefined;
  updateFormChange: Function;
  type: BioFormCategory;
  editMode: Boolean;
}) => {
  const handleChange = (text: string) => {
    updateFormChange(type, text);
  };

  return (
    <View pointerEvents={!editMode ? "none" : "auto"} style={styles.container}>
      <TextInput
        style={styles.form}
        onChangeText={handleChange}
        value={formValue}
        multiline
        maxLength={500}
        readOnly={!editMode}
        scrollEnabled={!!editMode}
      />
      {!formValue && (
        <ThemedText style={styles.warningText} type="warning">
          * Cannot be empty
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  warningText: {
    position: "absolute",
    bottom: 0,
  },
  form: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    // paddingHorizontal: 16,
    paddingBottom: 20,
  },
});

export default BioForm;
