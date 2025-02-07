import { PreferenceForm } from "@/types/preferenceForm";

const defaultPreferences: PreferenceForm & { age: number } = {
  age: 30,
  gender: {
    male: false,
    female: true,
  },
  interests: new Set([
    "Exercising",
    "Swimming",
    "Gym",
    "Cooking",
    "Movies",
    "Books",
  ]),
  personality: {
    introvert: {
      value: 30,
      label: "Introvert",
    },
    practical: {
      value: 30,
      label: "Practical",
    },
    logical: {
      value: 30,
      label: "Logical",
    },
    structured: {
      value: 30,
      label: "Structured",
    },
  },
};

export default defaultPreferences;
