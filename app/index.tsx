import { AppHeaderText } from "@/components";
import Overlay from "@/components/Overlay";
import { ThemedText } from "@/components/ThemedText";
import LandingButton from "@/components/ui/Button";
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, View, ImageBackground, Pressable } from "react-native";

const backgroundImage = require("@/assets/images/onboarding-background.png");

export default function HomeScreen() {
  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.background}
    >
      <Overlay />
      <View style={styles.container}>
        <View style={styles.landingHeader}>
          <AppHeaderText lightColor="white" darkColor="white">
            GenieMatch
          </AppHeaderText>
          <ThemedText style={styles.landingText}>
            Tired of swiping? Find your soulmate with GenieMatch—only hearts
            that rhyme in harmony.{" "}
          </ThemedText>
        </View>
        <View style={styles.landingButtonContainer}>
          <LandingButton push href="/main">
            <ThemedText
              style={styles.landingButtonText}
              darkColor={Colors.dark.darkText}
            >
              Begin Your Journey
            </ThemedText>
          </LandingButton>
          <LandingButton href={"./signup"} type="secondary">
            <ThemedText style={styles.landingButtonText} lightColor="white">
              Sign Up
            </ThemedText>
          </LandingButton>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    borderWidth: 1,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 50,
  },
  landingHeader: {
    color: "white",
    flex: 1,
    justifyContent: "center",
  },
  landingText: {
    color: "white",
    fontFamily: "OpenSans_400Regular",
  },
  landingButtonText: {
    fontFamily: "OpenSans_700Bold",
  },
  landingButtonContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 26,
  },
});
