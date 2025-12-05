import { create } from "zustand";

type Phase = "self" | "partner";

interface PersonalityStore {
	selfSelections: Record<string, string>;
	partnerSelections: Record<string, string>;
	setSelection: (phase: Phase, id: string, choice: string) => void;
	getSelections: (phase: Phase) => Record<string, string>;
}

export const usePersonalityStore = create<PersonalityStore>((set, get) => ({
	selfSelections: {},
	partnerSelections: {},
	setSelection: (phase, id, choice) =>
		set((state) => {
			if (phase === "self") {
				return {
					selfSelections: { ...state.selfSelections, [id]: choice },
				};
			} else {
				return {
					partnerSelections: { ...state.partnerSelections, [id]: choice },
				};
			}
		}),
	getSelections: (phase) => {
		return phase === "self" ? get().selfSelections : get().partnerSelections;
	},
}));
