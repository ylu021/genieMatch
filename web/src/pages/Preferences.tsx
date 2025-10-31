import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import type { PreferenceForm } from "@/types/preferenceForm";
import storage from "@/utils/storage";
import FormFormatter from "@/utils/formFormatter";
import DefaultPreferences from "@/constants/defaultPreferences";

const Preferences = () => {
	const navigate = useNavigate();
	const [formState, setFormState] =
		useState<PreferenceForm>(DefaultPreferences);

	useEffect(() => {
		// load default from storage
		const loadUserPreferences = async () => {
			const savedPreferences = await storage.getItem("userPreferences");
			if (savedPreferences) {
				setFormState(FormFormatter.parse(savedPreferences));
			}
		};

		loadUserPreferences();
	}, []);

	const handleUpdatePreferences = async () => {
		await storage.setItem(
			"userPreferences",
			FormFormatter.stringify(formState)
		);
		navigate("/main"); // close modal
	};

	const updateForm = (key: string, content: PreferenceForm["gender"]) => {
		setFormState((prev) => {
			return {
				...prev,
				[key]: content,
			};
		});
	};

	return (
		<div
			style={{
				backgroundColor: "#151718",
				minHeight: "100vh",
				paddingBottom: "32px",
			}}
		>
			<div
				style={{
					paddingLeft: "16px",
					paddingRight: "16px",
					paddingTop: "16px",
				}}
			>
				{/* Preferences sections will be added here */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						paddingLeft: "16px",
						paddingRight: "16px",
						marginBottom: "32px",
						marginTop: "32px",
					}}
				>
					<button
						onClick={() => navigate("/main")}
						style={{
							background: "transparent",
							border: "none",
							cursor: "pointer",
						}}
					>
						<ThemedText lightColor="white">Cancel</ThemedText>
					</button>
					<button
						onClick={() => handleUpdatePreferences()}
						style={{
							background: "transparent",
							border: "none",
							cursor: "pointer",
						}}
					>
						<ThemedText lightColor="white">Updated</ThemedText>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Preferences;
