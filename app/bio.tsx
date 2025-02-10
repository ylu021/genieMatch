import { fetchResponse } from "@/api/api";
import { BioFullForm } from "@/components/BioForm";
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

  useEffect(() => {
    const loadBio = async () => {
      const savedBio = await AsyncStorage.getItem("userBio");
      if (!savedBio) {
        // fetch default bio
        const value = Prompts.prompts[0].content;
        setLoading(true);
        const response = await fetchResponse(value);
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
