import { fetchResponse } from "@/api/api";
import { ThemedText } from "@/components/ThemedText";
import Prompts from "@/constants/prompts.json";
import type { BioFormType } from "@/types/bioForm";
import storage from "@/utils/storage";
import { useEffect, useState } from "react";

const Bio = () => {
	const [userBio, setUserBio] = useState<BioFormType>({
		bio: null,
		interestSeeking: null,
	});

	const [showAIMessage, setShowAIMessage] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setErrorMessage] = useState("");

	useEffect(() => {
		const loadBio = async () => {
			const savedBio = await storage.getItem("userBio");
			if (!savedBio) {
				// fetch default bio
				const value = Prompts.prompts[0].content;
				setLoading(true);
				const response = await fetchResponse(value).catch((error) => {
					console.error("API Error:", error);
					setErrorMessage(error.message);
					setLoading(false);
				});
				setLoading(false);
				const data = response?.content;
				if (data) {
					const { Bio: bio, interest: interestSeeking } = JSON.parse(data);
					setUserBio((prev) => ({
						...prev,
						bio,
						interestSeeking,
					}));

					setShowAIMessage(true);

					await storage.setItem(
						"userBio",
						JSON.stringify({ bio, interestSeeking })
					);
				}
			} else {
				const defaultBio = JSON.parse(savedBio);
				setUserBio((prev) => ({
					...prev,
					...defaultBio,
				}));
			}
		};

		loadBio();
	}, []);

	const updateUserBio = async (formValue: BioFormType) => {
		setUserBio((prev) => ({
			...prev,
			...formValue,
		}));
		await storage.setItem("userBio", JSON.stringify(formValue));
		setShowAIMessage(false);
	};

	return (
		<div
			style={{
				backgroundColor: "#151718",
				minHeight: "100vh",
				padding: "16px",
			}}
		>
			<div
				style={{
					paddingLeft: "16px",
					paddingRight: "16px",
				}}
			>
				{message && (
					<ThemedText darkColor="white" lightColor="white">
						{message}
						<ThemedText darkColor="white" lightColor="white">
							{import.meta.env.VITE_API_URL}
						</ThemedText>
					</ThemedText>
				)}
				{/* BioFullForm will be added here */}
			</div>
		</div>
	);
};

export default Bio;
