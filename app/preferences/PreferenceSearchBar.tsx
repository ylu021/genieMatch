import React from "react";
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

const PreferenceSearchBar = () => {
  const [text, onChangeText] = useState("Enter a bio to test the matching llm");

  return (
    <>
      <TextInput
        onChangeText={onChangeText}
        multiline={true}
        value={text}
        style={styles.input}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    zIndex: 1,
    height: 40,
    margin: 42,
    borderWidth: 1,
    padding: 40,
  },
});

export default PreferenceSearchBar;
