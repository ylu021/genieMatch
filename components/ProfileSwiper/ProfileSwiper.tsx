import React, { useRef } from "react";
import { Text, View, StyleSheet, Animated } from "react-native";
import Swiper from "react-native-deck-swiper";
import Users from "@/constants/profile.json";
import Icons from "@/constants/icons";
import { AppHeaderText, Card, IconWrapper, UserImage } from "..";

const ProfileSwiper = ({
  opacity,
  setUserSelection,
  handleSwiped,
}: {
  opacity: Animated.Value;
  setUserSelection: Function;
  handleSwiped: Function;
}) => {
  const scales = useRef(Icons.map(() => new Animated.Value(1))).current; // Create unique scales for each icon

  const handleSwipedLeft = (cardIndex: number) => {
    setUserSelection(-1);
    handleSwiped();
  };

  const handleSwipedDown = (cardIndex: number) => {
    setUserSelection(1);
    handleSwiped();
  };

  const handleSwipedRight = (cardIndex: number) => {
    setUserSelection(2);
    handleSwiped();
  };
  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    flexDirection: "row",
    marginTop: 25,
  },
});

export default ProfileSwiper;
