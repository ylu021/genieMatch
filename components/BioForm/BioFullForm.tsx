import { Colors } from "@/constants/Colors";
import modalStyles from "@/styles/modals";
import { BioFormCategory, BioFormType } from "@/types/bioForm";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Overlay from "../Overlay";
import Button from "../ui/Button";
import BioEditActionButtons from "./BioEditActionButtons";
import BioEditIcon from "./BioEditIcon";
import BioForm from "./BioForm";
import { ThemedText } from "@/components/ThemedText";
import FormFormatter from "@/utils/formFormatter";
import { fetchResponse } from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DefaultPreferences from "@/constants/defaultPreferences";

const BioFullForm = ({
  userBio,
  updateUserBio,
  showAIMessage,
}: {
  userBio: BioFormType;
  updateUserBio: (form: BioFormType) => void;
  showAIMessage: boolean;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [formValue, setFormValue] = useState(userBio);

  useEffect(() => {
    setFormValue(userBio);
  }, [userBio]);

  const cancel = () => {
    setEditMode(false);
    setFormValue(userBio);
  };
  const updateFormChange = (type: BioFormCategory, input: string) => {
    console.log("updateFormChange", type, input);
    setFormValue((prev) => {
      return {
        ...prev,
        [type]: input,
      };
    });
  };

  const generateBio = async () => {
    setEditMode(true);
    const userPreferences = await AsyncStorage.getItem("userPreferences");
    const preferences = userPreferences
      ? FormFormatter.parse(userPreferences)
      : DefaultPreferences;
    const promptFormatted = FormFormatter.generatePrompt(preferences);
    const response = await fetchResponse(promptFormatted, {
      "Cache-Control": "no-cache",
    });
    const data = response?.content ? JSON.parse(response?.content) : "";

    if (data) {
      const { Bio: bio, Interest: interestSeeking } = data;
      setFormValue({
        bio,
        interestSeeking,
      });
    }
  };

  const submitForm = () => {
    // // check formInput, emptyness already checked but still keep this function
    if (FormFormatter.validateBioForm(formValue)) {
      updateUserBio(formValue);
      setEditMode(false);
    }
  };
  return (
    <View style={modalStyles.section}>
      {/* Bio */}
      <View style={modalStyles.section}>
        <ThemedText type="subtitle">Your Bio</ThemedText>
        {showAIMessage && (
          <ThemedText>
            This is an example, click on AI Writer to try out your own profile!
          </ThemedText>
        )}
      </View>
      <View style={styles.bioContainer}>
        <BioForm
          type="bio"
          formValue={formValue.bio ?? ""}
          updateFormChange={updateFormChange}
          editMode={editMode}
        />
        {!editMode ? <BioEditIcon setEditMode={setEditMode} /> : null}
      </View>
      {/* Seeking */}
      <View style={modalStyles.section}>
        <ThemedText type="subtitle">Seeking</ThemedText>
      </View>
      <LinearGradient
        colors={["#FF9509", "#FE2042"]}
        style={styles.bioContainer}
      >
        <Overlay />
        <BioForm
          type="interestSeeking"
          formValue={formValue.interestSeeking ?? ""}
          updateFormChange={updateFormChange}
          editMode={editMode}
        />
        {!editMode ? <BioEditIcon setEditMode={setEditMode} /> : null}
      </LinearGradient>
      <View style={[modalStyles.section]}>
        <Button style={styles.aiButton} onPress={generateBio}>
          <FontAwesome name="magic" size={22} color={Colors.dark.text} />
          <ThemedText style={styles.aiButtonText} darkColor={Colors.dark.text}>
            AI writer
          </ThemedText>
        </Button>
        {editMode && (
          <BioEditActionButtons
            disabled={!FormFormatter.validateBioForm(formValue)}
            cancel={cancel}
            submit={submitForm}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bioContainer: {
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: "center",
    position: "relative",
  },
  aiButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    columnGap: 10,
    backgroundColor: "#9B59B6",
  },
  aiButtonText: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 14,
  },
});

export default BioFullForm;
