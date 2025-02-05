import GenderSections from "@/components/Preferences/GenderSections";
import InterestSections from "@/components/Preferences/InterestSections";
import { ThemedText } from "@/components/ThemedText";
import { PreferenceForm } from "@/types/preferenceForm";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormFormatter from "@/utils/formFormatter";

const Preferences = () => {
  const router = useRouter();
  const [formState, setFormState] = useState<PreferenceForm>({
    gender: {
      male: true,
      female: false,
    },
    interests: new Set([
      "Exercising",
      "Swimming",
      "Gym",
      "Cooking",
      "Movies",
      "Books",
    ]),
  });

  useEffect(() => {
    // load default from asyncstorage
    const loadUserPreferences = async () => {
      const savedPreferences = await AsyncStorage.getItem("userPreferences");
      if (savedPreferences) {
        setFormState(FormFormatter.parse(savedPreferences));
      }
    };

    loadUserPreferences();
  }, []);

  const handleUpdatePreferences = async () => {
    await AsyncStorage.setItem(
      "userPreferences",
      FormFormatter.stringify(formState)
    );
    router.push("/main"); // close modal
  };

  const updateForm = (key: string, content: PreferenceForm["gender"]) => {
    if (key === "gender") {
      setFormState((prev) => {
        return {
          ...prev,
          gender: content,
        };
      });
    } else if (key === "interests") {
      setFormState((prev) => {
        return {
          ...prev,
          interests: content,
        };
      });
    }
  };
  return (
    <View style={styles.modalContainer}>
      <ScrollView>
        <ThemedText darkColor="white">
          {JSON.stringify(formState, (_key, value) =>
            value instanceof Set ? [...value] : value
          )}
        </ThemedText>
        <View style={styles.section}>
          <GenderSections
            selectedGenders={formState.gender}
            updateForm={updateForm}
          />
        </View>
        <View style={styles.section}>
          <InterestSections
            selectedInterests={formState.interests}
            updateForm={updateForm}
          />
        </View>
        <View style={[styles.section, styles.list]}>
          <Pressable onPress={() => router.push("/main")}>
            <ThemedText>Cancel</ThemedText>
          </Pressable>
          <Pressable onPress={() => handleUpdatePreferences()}>
            <ThemedText>Updated</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  list: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
});

export default Preferences;
