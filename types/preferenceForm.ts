export interface PreferenceForm {
  gender: {
    male: boolean;
    female: boolean;
  };
  interests: Set<string>;
}
