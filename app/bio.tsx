import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Prompts from "@/constants/prompts.json";
import { fetchResponse } from "@/api/api";
import { ThemedText } from "@/components/ThemedText";
import { BioForm } from "@/types/bioForm";
import modalStyles from "@/styles/modals";
import Button from "@/components/ui/Button";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import Overlay from "@/components/Overlay";

const Bio = () => {
  const [userBio, setUserBio] = useState<BioForm>({
    bio: null,
    interestSeeking: null,
  });

  const [editMode, setEditMode] = useState(false);
  // const [showAiSave, setAiSave] = useState(false); // in edit mode

  useEffect(() => {
    const loadBio = async () => {
      const savedBio = await AsyncStorage.getItem("userBio");
      if (!savedBio) {
        // fetch default bio
        const value = Prompts.prompts[0].content;
        const response = await fetchResponse(value);
        const data = response?.content;
        if (data) {
          const { Bio: bio, interest: interestSeeking } = JSON.parse(data);
          setUserBio((prev) => ({
            ...prev,
            bio,
            interestSeeking,
          }));
          await AsyncStorage.setItem(
            "userBio",
            JSON.stringify({ bio, interestSeeking })
          );
        }
      } else {
        const defaultBio = JSON.parse(savedBio);
        setUserBio((prev) => ({
          ...prev,
          ...defaultBio,
        }));
      }
    };

    loadBio();
  }, []);

  const generateBio = async () => {
    // work on later
  };

  return (
    <View style={styles.modalContainer}>
      <View style={[modalStyles.section, styles.innerContainer]}>
        <View style={modalStyles.section}>
          <ThemedText type="subtitle">Your Bio</ThemedText>
        </View>
        <View style={styles.bioContainer}>
          <ThemedText type="defaultSemiBold">{userBio.bio}</ThemedText>
        </View>
        <View style={modalStyles.section}>
          <ThemedText type="subtitle">Seeking</ThemedText>
        </View>
        <LinearGradient
          colors={["#FF9509", "#FE2042"]}
          style={styles.bioContainer}
        >
          <Overlay />
          <ThemedText type="defaultSemiBold">
            {userBio.interestSeeking}
          </ThemedText>
        </LinearGradient>
        <View style={[modalStyles.section]}>
          <Button style={styles.aiButton} onPress={generateBio}>
            <FontAwesome name="magic" size={22} color={Colors.dark.text} />
            <ThemedText
              style={styles.aiButtonText}
              darkColor={Colors.dark.text}
            >
              AI writer
            </ThemedText>
          </Button>
          {/* <Button
            style={[modalStyles.section, styles.saveButton]}
            onPress={handleSubmit}
          >
            <ThemedText
              style={styles.aiButtonText}
              darkColor={Colors.dark.darkText}
            >
              Save
            </ThemedText>
          </Button> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 16,
  },
  innerContainer: {},
  bioContainer: {
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 20,
    height: 200,
    justifyContent: "center",
  },
  aiButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    columnGap: 10,
    backgroundColor: "#9B59B6",
  },
  saveButton: {
    width: "100%",
  },
  aiButtonText: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    // justifyContent: "center",
    paddingTop: "20%",
  },
});

export default Bio;
