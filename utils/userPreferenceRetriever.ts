import { PreferenceForm } from "@/types/preferenceForm";

const getUserPreferences = (formData: PreferenceForm) => {
  const { gender, interests } = formData;
  const sexualOrientation = getSexualOrientations(gender);
  const interestsString = new Array(interests).join(",");
  return { sexualOrientation, interestsString };
};

const getSexualOrientations = ({ male, female }: PreferenceForm["gender"]) => {
  if (male && female) {
    return "Bisexual";
  } else if (male || female) {
    return "Homosexual";
  } else {
    return "Heterosexual";
  }
};

export default {
  getUserPreferences,
};
