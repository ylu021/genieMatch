import Slider from "@react-native-community/slider";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";

const CustomSlider = ({
  value,
  minLabel,
  maxLabel,
  updateSliderValue,
}: {
  value: number;
  minLabel: string;
  maxLabel: string;
  updateSliderValue: (value: number) => void;
}) => {
  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#FFFFFF"
        value={value}
        onValueChange={updateSliderValue}
      />
      <View style={styles.sliderContainer}>
        {minLabel && <ThemedText type="sliderText">{minLabel}</ThemedText>}
        {maxLabel && <ThemedText type="sliderText">{maxLabel}</ThemedText>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
    // columnGap: 16,
    // flexWrap: "nowrap",
    alignItems: "center",
  },
  // left: {
  //   alignSelf: "flex-start",
  // },
  // right: {
  //   alignSelf: "flex-end",
  // },
  slider: {
    width: "90%",
    height: 40,
  },
});

export default CustomSlider;
