import modalStyles from "@/styles/modals";
import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "../ui/Button";
import { ThemedText } from "../ThemedText";
import { Colors } from "@/constants/Colors";

const BioEditActionButtons = ({
  cancel,
  submit,
  disabled,
}: {
  cancel: () => void;
  submit: () => void;
  disabled: boolean;
}) => {
  return (
    <View>
      <Button
        disabled={disabled}
        style={[
          modalStyles.section,
          styles.button,
          disabled ? styles.disabled : null,
        ]}
        onPress={submit}
      >
        <ThemedText style={styles.buttonText} darkColor={Colors.dark.darkText}>
          Save
        </ThemedText>
      </Button>
      <Button
        style={[modalStyles.section, styles.button, styles.grayButton]}
        onPress={cancel}
      >
        <ThemedText
          style={styles.buttonText}
          lightColor={Colors.dark.text}
          darkColor={Colors.dark.text}
        >
          Cancel
        </ThemedText>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
  },
  disabled: {
    backgroundColor: Colors.dark.greyColor,
  },
  buttonText: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 14,
  },
  grayButton: {
    backgroundColor: Colors.dark.background,
    borderWidth: 1,
    borderColor: Colors.dark.tint,
  },
});

export default BioEditActionButtons;
