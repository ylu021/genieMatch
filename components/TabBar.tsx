import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { Href, RelativePathString } from "expo-router";
import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";

const greyColor = "#737373";
const Icons = {
  index: (props: any) => (
    <AntDesign name="home" size={26} color={greyColor} {...props} />
  ),
  explore: (props: any) => (
    <AntDesign name="user" size={26} color={greyColor} {...props} />
  ),
};

export default function TabBar({ state, descriptors, navigation }) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            style={styles.tabbarItem}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {Icons[route.name]({
              color: isFocused ? greyColor : "white",
            })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    backgroundColor: "black",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
