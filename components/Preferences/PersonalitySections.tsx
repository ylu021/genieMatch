import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import SectionTitle from "../ui/SectionTitle";
import { PersonalityType, PreferenceForm } from "@/types/preferenceForm";
import PersonalitySlider from "./personality/PersonalitySlider";
import UserPreferenceRetriever from "@/utils/userPreferenceRetriever";

interface PersonalityOptionsProps {
  key: string;
  minLabel: string;
  maxLabel: string;
  label: keyof PersonalityType;
}

const personalityOptions: PersonalityOptionsProps[] = [
  {
    key: "personalityOptions_introvert",
    minLabel: "Quiet Thinker",
    maxLabel: "Social Butterfly",
    label: "introvert",
  },
  {
    key: "personalityOptions_practical",
    minLabel: "Practical",
    maxLabel: "Imaginative",
    label: "practical",
  },
  {
    key: "personalityOptions_logical",
    minLabel: "Logical",
    maxLabel: "Emotional",
    label: "logical",
  },
  {
    key: "personalityOptions_structured",
    minLabel: "Planner",
    maxLabel: "Go with the Flow",
    label: "structured",
  },
];

const PersonalitySections = ({
  selectedPersonalities,
  updateForm,
}: {
  selectedPersonalities: PreferenceForm["personality"];
  updateForm: Function;
}) => {
  const updateValue = (type: keyof PersonalityType, value: number) => {
    const rounded = Math.round(value);
    const newSelection = {
      ...selectedPersonalities,
      [type]: {
        ...selectedPersonalities[type],
        value: rounded,
        label: UserPreferenceRetriever.getTraitLabel(type, rounded),
      },
    };
    updateForm("personality", newSelection);
  };

  return (
    <View style={styles.container}>
      <SectionTitle>What's Your Inner Vibe?</SectionTitle>
      <View style={styles.personality}>
        {personalityOptions.map(({ minLabel, maxLabel, key, label }) => (
          <PersonalitySlider
            key={key}
            minLabel={minLabel}
            maxLabel={maxLabel}
            type={label}
            value={selectedPersonalities[label].value}
            updateValue={updateValue}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  personality: {
    flexDirection: "column",
  },
});

export default PersonalitySections;
