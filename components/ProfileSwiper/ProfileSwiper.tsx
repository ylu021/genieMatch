import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  ImageBackground,
  Dimensions,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import Users from "@/constants/profile.json";
import Icons from "@/constants/icons";
import { Card, IconWrapper } from "..";
import Overlay from "../Overlay";
import ProfileNameText from "@/components/ui/ProfileNameText";
import { ThemedText } from "../ThemedText";
import { LinearGradient } from "expo-linear-gradient";

const ProfileSwiper = ({
  setUserSelection,
  handleSwiped,
}: {
  setUserSelection: Function;
  handleSwiped: Function;
}) => {
  const swiperRef = useRef(null);
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
  const scales = useRef(Icons.map(() => new Animated.Value(1))).current; // Create unique scales for each icon

  const handleSwipedLeft = (cardIndex: number) => {
    setUserSelection(-1);
    handleSwiped();
  };

  const handleSwipedDown = (cardIndex?: number) => {
    setUserSelection(1);
    handleSwiped();
  };

  const handleSwipedRight = (cardIndex: number) => {
    setUserSelection(2);
    handleSwiped();
  };

  const updateSwipe = (iconIndex: number) => {
    if (iconIndex === 0) {
      swiperRef?.current?.swipeLeft(); // Trigger left swipe
    } else {
      swiperRef?.current?.swipeRight(); // Trigger left swipe
    }
  };

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        backgroundColor={"none"}
        infinite={true}
        cards={Users}
        swipeAnimationDuration={300}
        renderCard={(user) => {
          return (
            <View style={styles.cardContainer}>
              <Card>
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
                    <ProfileNameText lightColor="white">
                      {user.name}
                    </ProfileNameText>
                    <ThemedText lightColor="white">{user.bio}</ThemedText>
                  </View>
                </ImageBackground>
              </Card>
              <View style={styles.iconContainer}>
                {Icons.map((icon, index) => (
                  <IconWrapper
                    icon={icon}
                    scale={scales[index]}
                    index={index}
                    key={icon.id}
                    updateSwipe={updateSwipe}
                  />
                ))}
              </View>
            </View>
          );
        }}
        onSwipedRight={handleSwipedRight}
        onSwipedLeft={handleSwipedLeft}
        onSwipedBottom={handleSwipedDown}
      />
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  cardContainer: {
    flex: 1,
    width: "100%",
    marginTop: -50,
  },
  iconContainer: {
    width: "100%",
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
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
    // width: 300,
    // height: 400,
    position: "relative",
  },
  cardDescription: {
    position: "absolute",
    bottom: 0,
    padding: 16,
  },
});

export default ProfileSwiper;
