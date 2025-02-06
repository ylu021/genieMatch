export interface PreferenceForm {
  gender: {
    male: boolean;
    female: boolean;
  };
  interests: Set<string>;
}

type OrientationType = "Bisexual" | "Homosexual" | "Heterosexual";

export interface PreferenceParsed {
  sexualOrientation: OrientationType;
  interestsString: string;
}
