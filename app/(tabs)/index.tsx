import React, { useRef, useState } from "react";
import {
  Text,
  Image,
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Pressable,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import AntDesign from "react-native-vector-icons/AntDesign";
import users from "../../constants/profile.json";
import { PreferenceSearchBar } from "../preferences";

const icons = [
  { id: 1, name: "meho", color: "gray", size: 30 },
  { id: 2, name: "smile-circle", color: "orange", size: 40 },
  { id: 3, name: "heart", color: "red", size: 30 },
];

export default function HomeScreen() {
  const scales = useRef(icons.map(() => new Animated.Value(1))).current; // Create unique scales for each icon
  const opacity = useRef(new Animated.Value(0)).current; // nope text
  const [selection, setUserSelection] = useState(0);
  // const score = sharedInterests.length / totalInterests.length;

  const handlePressIn = (index: number) => {
    Animated.spring(scales[index], {
      toValue: 1.3,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = (index: number) => {
    Animated.spring(scales[index], {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleSwipedLeft = (cardIndex: number) => {
    opacity.setValue(1);
    setUserSelection(-1);
    Animated.timing(opacity, {
      toValue: 0, // Fade out to 0
      duration: 300, // Fade duration in ms
      useNativeDriver: true,
    }).start();
  };

  const handleSwipedDown = (cardIndex: number) => {
    opacity.setValue(1);
    setUserSelection(1);
    Animated.timing(opacity, {
      toValue: 0, // Fade out to 0
      duration: 300, // Fade duration in ms
      useNativeDriver: true,
    }).start();
  };

  const handleSwipedRight = (cardIndex: number) => {
    opacity.setValue(1);
    setUserSelection(2);
    Animated.timing(opacity, {
      toValue: 0, // Fade out to 0
      duration: 300, // Fade duration in ms
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <PreferenceSearchBar />
      <Swiper
        backgroundColor={"none"}
        infinite={true}
        cards={users}
        renderCard={(user) => (
          <View style={[styles.card]}>
            <Image source={{ uri: user.image }} style={styles.image} />
            <Text style={styles.text}>{user.name}</Text>
            <View style={styles.iconContainer}>
              {icons.map((icon, index) => (
                <Pressable
                  key={icon.id}
                  onPressIn={() => handlePressIn(index)}
                  onPressOut={() => handlePressOut(index)}
                  style={styles.iconWrapper}
                >
                  <Animated.View
                    style={{ transform: [{ scale: scales[index] }] }}
                  >
                    <AntDesign name={icon.name} size={40} color={icon.color} />
                  </Animated.View>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        onSwipedRight={handleSwipedRight}
        onSwipedLeft={handleSwipedLeft}
        onSwipedBottom={handleSwipedDown}
      />
      {/* Animated NOPE Message */}
      <Animated.View style={[styles.nopeContainer, { opacity }]}>
        {selection === -1 && <Text style={styles.nopeText}>NOPE</Text>}
        {selection === 2 && <Text style={styles.nopeText}>LOVE</Text>}
        {selection === 1 && <Text style={styles.nopeText}>LIKE</Text>}
      </Animated.View>
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1, // Border width
    borderColor: "blue",
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    height: 400,
    backgroundColor: "white",
    borderWidth: 1, // Border width
    borderRadius: 10,
    marginTop: 200,
  },
  image: { width: 200, height: 200, borderRadius: "100%", marginBottom: 10 },
  text: { fontSize: 20, marginTop: 10 },
  iconContainer: {
    flexDirection: "row",
    marginTop: 25,
  },
  iconWrapper: {
    marginHorizontal: 25, // Add horizontal space between icons
  },
  nopeContainer: {
    position: "absolute",
    top: "75%",
    left: screenWidth * 0.5 - 5,
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 10,
  },
  nopeText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "red",
  },
});
