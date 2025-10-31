import { useEffect, useState } from "react";
import { SwipeIndicators } from "@/components/SwipeIndicators";
import Overlay from "@/components/Overlay";
import storage from "@/utils/storage";
import { TinderSwipeCards } from "@/components/ProfileSwiper";
import TinderDeck from "@/components/TinderDeck";

const backgroundImage = "/images/main-background3.png";

export default function Main() {
	const [opacity, setOpacity] = useState(0);
	const [selection, setUserSelection] = useState(0);
	const [completed, setCompleted] = useState(false);
	const [formState, setFormState] = useState<any>(null);

	const handleSwiped = () => {
		setOpacity(1);
		setTimeout(() => {
			setOpacity(0);
		}, 300);
	};

	useEffect(() => {
		// load default from storage
		const loadUserPreferences = async () => {
			const savedPreferences = await storage.getItem("userPreferences");
			if (savedPreferences) {
				setFormState(JSON.parse(savedPreferences));
			}
		};

		loadUserPreferences();
	}, []);

	return (
		<div
			style={{
				width: "100vw",
				height: "100vh",
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundColor: "black",
				position: "relative",
			}}
		>
			<TinderDeck />
			{/* <div
				style={{
					flex: 1,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
					height: "100%",
					position: "relative",
				}}
			> */}
			{/* <TinderSwipeCards /> */}
			{/* <SwipeIndicators
					opacity={opacity}
					selection={selection}
					completed={completed}
				/> */}
			{/* </div> */}
		</div>
	);
}
