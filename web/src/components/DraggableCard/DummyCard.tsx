import { useDraggable } from "@dnd-kit/core";

export default function DummyCard() {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: "test-card",
	});

	const style = {
		transform: transform
			? `translate3d(${transform.x}px, ${transform.y}px, 0)`
			: undefined,
		backgroundColor: "white",
		width: 200,
		height: 200,
		borderRadius: 16,
		boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
		position: "absolute" as const,
		top: "50%",
		left: "50%",
		translate: "-50% -50%",
		cursor: "grab",
	};

	return (
		<div ref={setNodeRef} {...listeners} {...attributes} style={style}>
			Drag me 🧲
		</div>
	);
}
