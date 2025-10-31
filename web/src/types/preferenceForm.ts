export interface PreferenceForm {
  age?: number;
  gender: {
    male: boolean;
    female: boolean;
  };
  interests: Set<string>;
  personality: {
    [key in keyof PersonalityType]: PersonalityFormType;
  };
}

type OrientationType = "Bisexual" | "Homosexual" | "Heterosexual";

export interface PersonalityType {
  introvert: "Introvert" | "Extravert";
  practical: "Practical" | "Imaginative";
  logical: "Logical" | "Emotional";
  structured: "Structured" | "Flexible";
}

interface PersonalityFormType {
  value: number;
  label: PersonalityType[keyof PersonalityType];
}

export interface PreferenceParsed {
  sexualOrientation: OrientationType;
  interestsString: string;
  personalityString: string;
}

