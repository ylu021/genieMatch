import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import SectionTitle from "../ui/SectionTitle";
import PillLabel from "../PillLabel";
import { PreferenceForm } from "@/types/preferenceForm";
import { ThemedText } from "../ThemedText";
const pillColor = "rgba(254,32,66,0.75)";
const pillColorSelected = "rgba(254,32,66,1)";

interface GenderOptionsProps {
  label: "Male" | "Female";
  key: Gender;
}

const genderOptions: GenderOptionsProps[] = [
  { label: "Male", key: "male" },
  { label: "Female", key: "female" },
];

type Gender = "male" | "female";

const GenderSections = ({
  selectedGenders,
  updateForm,
}: {
  selectedGenders: PreferenceForm["gender"];
  updateForm: Function;
}) => {
  const toggleSelection = (gender: Gender) => {
    const newSelection = {
      ...selectedGenders,
      [gender]: !selectedGenders[gender],
    };
    updateForm("gender", newSelection);
  };

  return (
    <View style={styles.container}>
      <SectionTitle>Attracted To</SectionTitle>
      <View style={styles.gender}>
        {genderOptions.map(({ label, key: gender }) => (
          <PillLabel
            key={gender}
            bgColor={
              selectedGenders[gender] ? pillColorSelected : "transparent"
            }
            text={label}
            fat
            outline={!selectedGenders[gender] ? pillColorSelected : undefined}
            onPress={() => toggleSelection(gender)}
          />
        ))}
        {!selectedGenders.female && !selectedGenders.male && (
          <ThemedText style={styles.warningText} type="warning">
            *Must select one
          </ThemedText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  gender: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    marginTop: 16,
  },
  warningText: {
    marginLeft: 5,
  },
});

export default GenderSections;
