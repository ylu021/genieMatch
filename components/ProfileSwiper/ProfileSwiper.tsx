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
              <Card user={user} />
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
});

export default ProfileSwiper;
