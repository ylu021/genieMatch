import React from "react";
import { useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";

const PreferenceSearchBar = () => {
  const [prompt, setPrompt] = useState("Enter a bio to test the matching llm");

  const handleTest = (testId: string) => {
    setPrompt("");
  };

  return (
    <>
      <TextInput
        onChangeText={setPrompt}
        multiline={true}
        value={prompt}
        style={styles.input}
      />
      <Button title="Test 1" onPress={() => handleTest("1")} />
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
