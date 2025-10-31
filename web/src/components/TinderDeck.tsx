import DraggableCard from "@/components/DraggableCard/DraggableCard";
import { DropZone } from "@/components/DropZone/DropZone";
import { DndContext, rectIntersection, type DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import PROFILES from "@/constants/profile.json";
import type { DeckSwipeDirection } from "@/types/deckSwipeActions";
import type { Profile } from "@/types/profile";

const TinderDeck = () => {
	const [cards, setCards] = useState(PROFILES);
	const [activeIndex, setActiveIndex] = useState(cards.length - 1); // top card index
	const [swipeDirection, setSwipeDirection] =
		useState<DeckSwipeDirection>(null);
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) {
			return;
		}

		if (over.id === "left") {
			setSwipeDirection("left");
		} else if (over.id === "right") {
			setSwipeDirection("right");
		} else {
			setSwipeDirection(null);
		}
	};
	const handleSwipeEnd = () => {
		setCards((prev) => {
			const updated = [...prev];
			const top = updated.pop();
			if (top) updated.unshift(top); // give new key for React
			return updated;
		});
		setSwipeDirection(null); // 👈 Reset back to middle
	};

	const handleRequestSwipe = (dir: DeckSwipeDirection) => {
		setSwipeDirection(dir);
	};

	return (
		<DndContext
			onDragEnd={handleDragEnd}
			collisionDetection={(args) => {
				// Default collisions
				const collisions = rectIntersection(args);

				if (!collisions.length) return [];

				// Filter: only keep zones when card is beyond X threshold
				const draggableRect = args.active.rect.current.translated;
				if (!draggableRect) return [];

				const screenWidth = window.innerWidth;

				const centerX = draggableRect.left + draggableRect.width / 2;
				const leftLimit = screenWidth * 0.35; // 👈 threshold for left swipe
				const rightLimit = screenWidth * 0.65; // 👈 threshold for right swipe

				if (centerX < leftLimit) {
					console.log("👈 Left swipe");
					return [{ id: "left" }];
				}
				if (centerX > rightLimit) {
					console.log("👉 Right swipe");
					return [{ id: "right" }];
				}

				return [];
			}}
		>
			<div
				className="relative w-full bg-neutral-100 overflow-hidden"
				style={{ height: "100dvh" }}
			>
				<DropZone id="left" side="left" />
				<DropZone id="right" side="right" />
				{/* Stack all cards */}
				{cards.map((card, index) => (
					<DraggableCard
						key={card.id}
						id={card.id}
						profile={card as Profile}
						swipeDirection={index === cards.length - 1 ? swipeDirection : null}
						onSwipeEnd={handleSwipeEnd}
						isTop={index === cards.length - 1}
						zIndex={index + 1}
						activeIndex={activeIndex}
						onRequestSwipe={handleRequestSwipe}
					/>
				))}

				{cards.length === 0 && (
					<div className="text-gray-500 text-lg font-medium">
						There are no cards to show
					</div>
				)}
			</div>
		</DndContext>
	);
};

export default TinderDeck;
