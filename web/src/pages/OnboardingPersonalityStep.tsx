import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ThemedText } from "@/components/ThemedText";
import PersonalityChoiceCard from "@/components/ui/PersonalityChoiceCard";
import { usePersonalityStore } from "@/stores/personalityStore";
import { personalityMock } from "@/api/personalityMock";
import personalityStepsData from "@/constants/personalitySteps.json";

type Phase = "self" | "partner";

interface PersonalityStep {
	id: string;
	prompt_self: string;
	prompt_partner: string;
	options: {
		id: string;
		label_self: string;
		label_partner: string;
	}[];
	category: string;
}

interface SelectionResult {
	id: string;
	choice: string;
	phase: Phase;
}

const OnboardingPersonalityStep = () => {
	const navigate = useNavigate();
	const { setSelection, getSelections } = usePersonalityStore();
	const [phase, setPhase] = useState<Phase>("self");
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	// State to track all selections in the format: [{ id, choice, phase }, ...]
	const [selectionResults, setSelectionResults] = useState<SelectionResult[]>(
		[]
	);
	const questions = personalityStepsData as PersonalityStep[];

	// Log selection results when they change (for debugging/verification)
	useEffect(() => {
		if (selectionResults.length > 0) {
			console.log("Selection results:", selectionResults);
		}
	}, [selectionResults]);

	const currentQuestion = questions[currentQuestionIndex];
	const selections = getSelections(phase);
	const selectedOptionId = currentQuestion
		? selections[currentQuestion.id]
		: null;

	const isLastQuestion = currentQuestionIndex === questions.length - 1;
	const isLastPhase = phase === "partner";

	const handleCardSelect = (optionId: string) => {
		if (!currentQuestion) return;

		setSelection(phase, currentQuestion.id, optionId);

		// Add to selection results array
		setSelectionResults((prev) => {
			// Remove any existing selection for this question/phase combination
			const filtered = prev.filter(
				(item) => !(item.id === currentQuestion.id && item.phase === phase)
			);
			// Add the new selection
			const updated = [
				...filtered,
				{
					id: currentQuestion.id,
					choice: optionId,
					phase: phase,
				},
			];

			// Log final results when all questions are completed
			if (isLastQuestion && isLastPhase) {
				console.log("Final selection results:", updated);
			}

			return updated;
		});

		personalityMock.recordChoice({
			step: "personality_exploration",
			questionId: currentQuestion.id,
			choice: optionId,
			phase: phase,
			timestamp: Date.now(),
		});

		// Auto-advance after a short delay to show selection animation
		setTimeout(() => {
			personalityMock.recordStepCompletion({
				id: currentQuestion.id,
				choice: optionId,
				phase: phase,
			});

			if (isLastQuestion && isLastPhase) {
				// All questions completed for both phases
				navigate("/main");
			} else if (isLastQuestion && phase === "self") {
				// Finished self phase, move to partner phase
				setPhase("partner");
				setCurrentQuestionIndex(0);
			} else {
				// Move to next question
				setCurrentQuestionIndex(currentQuestionIndex + 1);
			}
		}, 500); // 500ms delay to show selection animation
	};

	if (!currentQuestion) {
		return null;
	}

	const currentPrompt =
		phase === "self"
			? currentQuestion.prompt_self
			: currentQuestion.prompt_partner;
	const subtext =
		phase === "self"
			? "Choose the one that feels most like you."
			: "Choose what attracts you in a partner.";

	// Color palette from preferences/interests
	const colorPalette = [
		"#3498DB", // Blue - Intellectual
		"#9B59B6", // Purple - Entertainment
		"#E67E22", // Orange - Food & Drinks
		"#16A085", // Teal - Travel
		"#F39C12", // Yellow - Arts
		"#E74C3C", // Red - Music
		"#2ECC71", // Green - Lifestyle
		"#FF5733", // Orange/Red - Fitness
	];

	// Assign colors to options based on question index and option index
	const getCardColor = (optionIndex: number) => {
		const baseIndex = currentQuestionIndex * 2 + optionIndex;
		return colorPalette[baseIndex % colorPalette.length];
	};

	return (
		<div
			style={{
				backgroundColor: "#151718",
				minHeight: "100vh",
				padding: "16px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<div
				style={{
					width: "100%",
					maxWidth: "600px",
					display: "flex",
					flexDirection: "column",
					gap: "32px",
				}}
			>
				{/* Header */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "8px",
						textAlign: "center",
					}}
				>
					<ThemedText type="subtitle" lightColor="white" darkColor="white">
						{currentPrompt}
					</ThemedText>
					<ThemedText type="default" lightColor="white" darkColor="white">
						{subtext}
					</ThemedText>
				</div>

				{/* Cards Container */}
				<AnimatePresence mode="wait">
					<motion.div
						key={`${currentQuestion.id}-${phase}`}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.2 }}
						style={{
							display: "flex",
							flexDirection: "row",
							gap: "16px",
							justifyContent: "center",
						}}
					>
						{currentQuestion.options.map((option, optionIndex) => (
							<PersonalityChoiceCard
								key={option.id}
								id={option.id}
								label={
									phase === "self" ? option.label_self : option.label_partner
								}
								selected={selectedOptionId === option.id}
								onSelect={handleCardSelect}
								color={getCardColor(optionIndex)}
							/>
						))}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
};

export default OnboardingPersonalityStep;
