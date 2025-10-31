import type { PreferenceForm, PreferenceParsed } from "@/types/preferenceForm";
import PersonalityCalculator from "./personalityCalculator";

const getUserPreferences = (formData: PreferenceForm): PreferenceParsed => {
	const { gender, interests, personality } = formData;
	const sexualOrientation = getSexualOrientations(gender);
	const interestsString = Array.from(interests).join(",");
	const personalityString = formatPersonality(personality);
	return { sexualOrientation, interestsString, personalityString };
};

const getTraitLabel = (
	category: keyof PreferenceForm["personality"],
	score: number
) => {
	switch (category) {
		case "introvert":
			return PersonalityCalculator.getIntrovertLabel(score);
		case "practical":
			return PersonalityCalculator.getPracticalLabel(score);
		case "logical":
			return PersonalityCalculator.getLogicalLabel(score);
		case "structured":
			return PersonalityCalculator.getStructuredLabel(score);
	}
};

const formatPersonality = (personality: PreferenceForm["personality"]) => {
	return Object.values(personality)
		.map((p) => p.label)
		.join(",");
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
	getTraitLabel,
};
