import React, { useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Swiper from "react-native-deck-swiper";
import Users from "@/constants/profile.json";
import Icons from "@/constants/icons";
import { AppHeaderText, Card, IconWrapper, UserImage } from "../components";

const ProfileSwiper = ({
  opacity,
  setUserSelection,
}: {
  opacity: Animated.Value;
  setUserSelection: Function;
}) => {
  const scales = useRef(Icons.map(() => new Animated.Value(1))).current; // Create unique scales for each icon

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
    <Swiper
      backgroundColor={"none"}
      infinite={true}
      cards={Users}
      renderCard={(user) => (
        <Card>
          <UserImage image={user.image} />
          <AppHeaderText>{user.name}</AppHeaderText>
          <View style={styles.iconContainer}>
            {Icons.map((icon, index) => (
              <IconWrapper
                icon={icon}
                scale={scales[index]}
                index={index}
                key={icon.id}
              />
            ))}
          </View>
        </Card>
      )}
      onSwipedRight={handleSwipedRight}
      onSwipedLeft={handleSwipedLeft}
      onSwipedBottom={handleSwipedDown}
    />
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    marginTop: 25,
  },
});

export default ProfileSwiper;
