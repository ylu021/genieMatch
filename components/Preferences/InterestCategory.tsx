import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { ThemedText } from "../ThemedText";
import Interests from "@/constants/interests.json";
import PillLabel from "../PillLabel";
import hexToRgba from "hex-to-rgba";

const InterestCategory = ({
  category,
  selected,
  toggleSelection,
}: {
  category: InterestsCategory;
  selected: Set<string>;
  toggleSelection: Function;
}) => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.category}>
        {Interests[category].title}
      </ThemedText>
      <View style={styles.interestList}>
        {Interests[category].items.map((item) => {
          const activeBgColor = hexToRgba(Interests[category].bgmColor);
          const bgColor = hexToRgba(Interests[category].bgmColor, 0.3);
          return (
            <PillLabel
              key={item}
              bgColor={selected.has(item) ? activeBgColor : bgColor}
              text={item}
              fat
              onPress={() => toggleSelection(item)}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  interestList: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 5,
    rowGap: 16,
  },
  category: {
    fontSize: 14,
    fontFamily: "SourceSansPro_400Regular",
    marginBottom: 5,
  },
});

export default InterestCategory;
