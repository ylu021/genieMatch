import { BioFormType } from "@/types/bioForm";
import { PreferenceForm } from "@/types/preferenceForm";
import UserPreferenceRetriever from "./userPreferenceRetriever";
import PromptTemplate from "@/constants/promptTemplate.json";
import DefaultPreferences from "@/constants/defaultPreferences";

const stringify = (formData: Partial<PreferenceForm>) =>
  JSON.stringify(formData, (_key, value) =>
    value instanceof Set ? [...value] : value
  );

// Your custom parsing function (which converts arrays back to Sets)
const parse = (stringObject: string) =>
  JSON.parse(stringObject, (_key, value) =>
    Array.isArray(value) ? new Set(value) : value
  );

const validateBioForm = (form: BioFormType) => {
  return !form || Object.values(form).filter((v) => !v.trim()).length === 0; // filter only the empty ones
};

const generatePrompt = (preferences: PreferenceForm) => {
  const preferenceParsed =
    UserPreferenceRetriever.getUserPreferences(preferences);
  const defaultTestAge = DefaultPreferences.age.toString();
  const data: { [key: string]: string } = {
    ...preferenceParsed,
    age: defaultTestAge,
  };
  const prompt = PromptTemplate.prompt;
  return prompt.replace(/{{(.*?)}}/g, (_, key) => {
    if (key in data) {
      return data[key];
    }
    return ``;
  });
};

export default {
  stringify,
  parse,
  validateBioForm,
  generatePrompt,
};
