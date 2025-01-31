import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Prompts from "@/constants/prompts.json";
import AppHeaderText from "../ui/AppHeaderText";
import { BioView } from "../BioView";

async function fetchResponse(prompt: string) {
  console.log(prompt);
  return fetch("http://localhost:8000/api/message/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  })
    .then((res) => res.json())
    .catch((e) => console.error(e));
}

const PreferenceSearchBar = () => {
  const [prompt, setPrompt] = useState("Enter a bio to test the matching llm");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleTest = async (testId?: string) => {
    const value = Prompts.prompts[0].content;
    setPrompt(Prompts.prompts[0].content);
    setLoading(true);
    const response = await fetchResponse(value);
    setData(JSON.parse(response?.content ?? {}));
    console.log(data);
    setLoading(false);
  };
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={setPrompt}
        multiline={true}
        value={prompt}
        style={styles.input}
      />
      <TouchableOpacity onPress={() => handleTest()} style={styles.submit}>
        <Text style={styles.submitText}>Test 1</Text>
      </TouchableOpacity>
      <AppHeaderText>Suggestion for Bio</AppHeaderText>
      <BioView loading={loading} data={data} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    zIndex: 1,
    height: 200,
    margin: 42,
    borderWidth: 1,
    padding: 10,
  },
  submit: {
    backgroundColor: "black",
    padding: 10,
    marginBottom: 20,
    borderRadius: "10%",
    width: 60,
  },
  submitText: {
    color: "white",
  },
});

export default PreferenceSearchBar;
