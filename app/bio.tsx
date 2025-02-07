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
        console.log(61);
      }
    };

    loadBio();
  }, []);

  const generateBio = async () => {
    // setEditMode(true);
    // work on later
  };

  // const updateUnsavedBio = (type: string, value: string | undefined) => {
  //   console.log(74, "updated", unsavedForm);
  //   setUnsavedForm((prev) => {
  //     return {
  //       ...prev,
  //       [type]: value,
  //     };
  //   });
  // };

  // const cancel = () => {
  //   // restore unsavedForm
  //   setUnsavedForm();
  // };

  const updateUserBio = async (formValue: BioFormType) => {
    // validate input
    console.log("updateUserBio", JSON.stringify(formValue));
    // same time update view
    setUserBio((prev) => ({
      ...prev,
      ...formValue,
    }));
    await AsyncStorage.setItem("userBio", JSON.stringify(formValue));
  };

  return (
    <View style={modalStyles.modalContainer}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <BioFullForm
          updateUserBio={updateUserBio}
          userBio={userBio}
          // editMode={editMode}
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
