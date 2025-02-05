import React from "react";
import {
  Button,
  GestureResponderEvent,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import AppHeaderText from "../ui/AppHeaderText";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import ProfileNameText from "../ui/ProfileNameText";
import { Colors } from "@/constants/Colors";
import GenderSections from "./GenderSections";

const PreferenceModal = ({
  hide,
  visible,
}: {
  hide: (event: GestureResponderEvent) => void;
  visible: boolean;
}) => (
  <Modal visible={visible} animationType="fade" onRequestClose={hide}>
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.section}>
        <GenderSections />
      </View>
      <View style={styles.section}>
        <Pressable onPress={hide}>
          <ThemedText>Cancel</ThemedText>
        </Pressable>
        <Pressable onPress={hide}>
          <ThemedText>Updated</ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  </Modal>
);

// sexual orientation female, male, bi
// interests:
// MBTI dragger

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginVertical: 16,
  },
});

export default PreferenceModal;
