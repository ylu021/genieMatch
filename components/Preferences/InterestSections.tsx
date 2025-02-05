import Interests from "@/constants/interests.json";
import { PreferenceForm } from "@/types/preferenceForm";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import SectionTitle from "../ui/SectionTitle";
import InterestCategory from "./InterestCategory";
import { ThemedText } from "../ThemedText";

const InterestSections = ({
  selectedInterests,
  updateForm,
}: {
  selectedInterests: PreferenceForm["interests"];
  updateForm: Function;
}) => {
  const toggleSelection = (item: string) => {
    let newSelection;
    if (selectedInterests.has(item)) {
      newSelection = new Set(selectedInterests);
      newSelection.delete(item);
    } else {
      newSelection = new Set([...selectedInterests, item]);
    }
    updateForm("interests", newSelection);
  };
  return (
    <View>
      <SectionTitle>
        Interests{" "}
        {selectedInterests.size === 0 && (
          <ThemedText style={styles.warningText} type="warning">
            *Must select one
          </ThemedText>
        )}
      </SectionTitle>
      <View style={styles.interestSection}>
        {Object.keys(Interests).map((category: keyof InterestsType) => {
          return (
            <InterestCategory
              key={Interests[category].key}
              category={category as InterestsCategory}
              toggleSelection={toggleSelection}
              selected={selectedInterests}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  interestSection: {
    marginTop: 10,
  },
  warningText: {
    marginLeft: 5,
  },
});

export default InterestSections;
