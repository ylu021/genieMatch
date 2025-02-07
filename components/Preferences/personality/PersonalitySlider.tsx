import Slider from "@/components/ui/Slider";
import { PersonalityType } from "@/types/preferenceForm";
import React from "react";
import { View } from "react-native";

const PersonalitySlider = ({
  minLabel,
  maxLabel,
  value,
  type,
  updateValue,
}: {
  minLabel: string;
  maxLabel: string;
  type: keyof PersonalityType;
  value: number;
  updateValue: (type: keyof PersonalityType, value: number) => void;
}) => {
  const updateSliderValue = (value: number) => {
    updateValue(type, value);
  };
  return (
    <View>
      <Slider
        value={value}
        updateSliderValue={updateSliderValue}
        minLabel={minLabel}
        maxLabel={maxLabel}
      />
    </View>
  );
};

export default PersonalitySlider;
