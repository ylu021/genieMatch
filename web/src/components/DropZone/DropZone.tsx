// DropZone.tsx
import { useDroppable } from "@dnd-kit/core";

interface DropZoneProps {
	id: string;
	side: "left" | "right";
}

export function DropZone({ id, side }: DropZoneProps) {
	const { setNodeRef, isOver } = useDroppable({ id });

	const style: React.CSSProperties = {
		position: "absolute" as const,
		top: 0,
		bottom: 0,
		[side]: 0, // left: 0 or right: 0
		width: "50%",
		backgroundColor: isOver
			? side === "left"
				? "rgba(255, 0, 0, 0.1)" // red tint
				: "rgba(0, 255, 0, 0.1)" // green tint
			: "transparent",
		transition: "background-color 0.2s ease",
		pointerEvents: "none", // avoids blocking drag events
		zIndex: 1,
	};

	return <div ref={setNodeRef} style={style} />;
}
