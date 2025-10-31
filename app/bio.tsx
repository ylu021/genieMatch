import { fetchResponse } from "@/api/api";
import { BioFullForm } from "@/components/BioForm";
import { ThemedText } from "@/components/ThemedText";
import Prompts from "@/constants/prompts.json";
import modalStyles from "@/styles/modals";
import { BioFormType } from "@/types/bioForm";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const Bio = () => {
  const [userBio, setUserBio] = useState<BioFormType>({
    bio: null,
    interestSeeking: null,
  });

  const [showAIMessage, setShowAIMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setErrorMessage] = useState("");

  useEffect(() => {
    const loadBio = async () => {
      const savedBio = await AsyncStorage.getItem("userBio");
      // await AsyncStorage.removeItem("userBio");
      if (!savedBio) {
        // fetch default bio
        const value = Prompts.prompts[0].content;
        setLoading(true);
        const response = await fetchResponse(value).catch((error) => {
          console.error("API Error:", error);
          setErrorMessage(error.message); // Set the error message
          setLoading(false);
        });
        setLoading(false);
        const data = response?.content;
        if (data) {
          const { Bio: bio, interest: interestSeeking } = JSON.parse(data);
          setUserBio((prev) => ({
            ...prev,
            bio,
            interestSeeking,
          }));

          setShowAIMessage(true);

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
        console.log(61);
      }
    };

    loadBio();
  }, []);

  const updateUserBio = async (formValue: BioFormType) => {
    // same time update view
    setUserBio((prev) => ({
      ...prev,
      ...formValue,
    }));
    await AsyncStorage.setItem("userBio", JSON.stringify(formValue));
    setShowAIMessage(false);
  };

  return (
    <View style={modalStyles.modalContainer}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {message && (
          <ThemedText darkColor="white" lightColor="white">
            {message}
            <ThemedText darkColor="white" lightColor="white">
              {process.env.EXPO_PUBLIC_API_URL}
            </ThemedText>
          </ThemedText>
        )}
        <BioFullForm
          updateUserBio={updateUserBio}
          userBio={userBio}
          showAIMessage={showAIMessage}
          loading={loading}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
  },
  footer: {
    flexDirection: "row",
    // justifyContent: "center",
    paddingTop: "20%",
  },
});

export default Bio;
