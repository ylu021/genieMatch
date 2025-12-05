interface OverlayProps {
	type?: "black" | "semi-black" | "white";
	darkerOverlay?: boolean;
	className?: string;
}

export default function Overlay({
	type = "black",
	darkerOverlay = false,
	className = "",
}: OverlayProps) {
	const getBackgroundColor = () => {
		if (darkerOverlay) {
			return "rgba(0,0,0, 0.7)";
		}
		if (type === "white") {
			return "rgba(255, 255, 255, 0.1)";
		}
		if (type === "semi-black") {
			return "rgba(0, 0, 0, 0.5)";
		}
		return "rgba(0, 0, 0, 0.1)";
	};

	return (
		<div
			style={{
				backgroundColor: getBackgroundColor(),
			}}
			className={`p-5 rounded-[10px] absolute top-0 left-0 right-0 bottom-0 ${className}`}
		/>
	);
}
