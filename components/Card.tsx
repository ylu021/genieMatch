import { View, StyleSheet, Dimensions, ImageBackground } from "react-native";
import React from "react";
import Overlay from "./Overlay";
import { LinearGradient } from "expo-linear-gradient";
import ProfileNameText from "./ui/ProfileNameText";
import { ThemedText } from "./ThemedText";
import PillLabel from "./PillLabel";

const getProfileImage = (imageName: string) => {
  const images: {
    [key: string]: any;
  } = {
    user1: require("@/assets/images/profiles/user1.png"),
    user2: require("@/assets/images/profiles/user2.png"),
    user3: require("@/assets/images/profiles/user3.png"),
    user4: require("@/assets/images/profiles/user4.png"),
    user5: require("@/assets/images/profiles/user5.png"),
  };

  return images[imageName] || images["user1"]; // 默认返回 user1
};

const Card = ({
  user,
}: {
  user: {
    name: string;
    age: number;
    bio: string;
    interests: string[];
    image: string;
  };
}) => {
  return (
    <View style={[styles.card]}>
      <ImageBackground
        source={getProfileImage(user.image)}
        resizeMode="cover"
        style={styles.cardImage}
      >
        <Overlay type="white" />
        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 0.7)"]} // Transparent at top, dark at bottom
          style={styles.gradient}
        />
        <View style={styles.cardDescription}>
          <View style={styles.titleRow}>
            <ProfileNameText lightColor="white">{user.name}</ProfileNameText>
            <ThemedText type="largeText" style={styles.ageText}>
              {user.age}
            </ThemedText>
          </View>
          <View style={styles.interestRow}>
            {user.interests.map((interest) => (
              <PillLabel key={interest} text={interest} />
            ))}
          </View>
          <ThemedText lightColor="white">{user.bio}</ThemedText>
        </View>
      </ImageBackground>
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  card: {
    width: screenWidth - 10,
    justifyContent: "center",
    alignSelf: "center",
    height: 580,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%", // Adjust gradient height
  },
  cardImage: {
    flex: 1,
    position: "relative",
  },
  cardDescription: {
    position: "absolute",
    bottom: 0,
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    columnGap: 6,
  },
  ageText: {
    color: "rgba(255,255,255,0.75)",
  },
  interestRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 5,
    marginVertical: 5,
  },
});

export default Card;
