interface RecordChoicePayload {
	step: string;
	questionId: string;
	choice: string;
	phase?: "self" | "partner";
	timestamp: number;
}

interface RecordStepCompletionPayload {
	id: string;
	choice: string;
	phase?: "self" | "partner";
}

export const personalityMock = {
	recordChoice: (payload: RecordChoicePayload) => {
		console.log("[MOCK] recordChoice", payload);
	},
	recordStepCompletion: (payload: RecordStepCompletionPayload) => {
		console.log("[MOCK] stepCompleted", payload);
	},
};
