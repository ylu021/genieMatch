import { motion } from "framer-motion";
import { ThemedText } from "../ThemedText";

interface PersonalityChoiceCardProps {
	id: string;
	label: string;
	icon?: string;
	selected: boolean;
	onSelect: (id: string) => void;
	color?: string;
}

const PersonalityChoiceCard = ({
	id,
	label,
	selected,
	onSelect,
	color = "#3498DB",
}: PersonalityChoiceCardProps) => {
	// Convert hex to rgba for opacity variations
	const hexToRgba = (hex: string, alpha: number) => {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	};

	const backgroundColor = selected ? color : hexToRgba(color, 0.15);
	const borderColor = selected ? color : hexToRgba(color, 0.3);

	return (
		<motion.div
			onClick={() => onSelect(id)}
			whileHover={{
				scale: 1.02,
				boxShadow: `0 10px 25px ${hexToRgba(color, 0.25)}`,
			}}
			animate={{
				scale: selected ? 1.05 : 1,
				boxShadow: selected
					? `0 10px 25px ${hexToRgba(color, 0.4)}`
					: `0 2px 8px ${hexToRgba(color, 0.1)}`,
			}}
			transition={{ duration: 0.15 }}
			style={{
				borderRadius: "10px",
				padding: "16px",
				backgroundColor: backgroundColor,
				border: `2px solid ${borderColor}`,
				cursor: "pointer",
				minWidth: "100px",
				flex: 1,
			}}
		>
			<ThemedText type="defaultSemiBold" style={{ color: "white" }}>
				{label}
			</ThemedText>
		</motion.div>
	);
};

export default PersonalityChoiceCard;
