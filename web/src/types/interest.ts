export interface InterestCategoryType {
  key: InterestsCategory;
  title: string;
  bgmColor: string;
  items: string[];
}

// Define the main Interests object type
export type InterestsType = Record<string, InterestCategoryType>;
export type InterestsCategory =
  | "fitness_sports"
  | "entertainment_pop_culture"
  | "intellectual_hobbies"
  | "food_drinks"
  | "travel_adventures"
  | "arts_creativity"
  | "music_dance"
  | "lifestyle_personality";

