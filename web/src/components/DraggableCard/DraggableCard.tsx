// TinderCard.tsx
import ProfileCard from "@/components/ProfileCard";
import SwipeIndicator from "@/components/SwipeIndicator";
import type { DeckSwipeDirection } from "@/types/deckSwipeActions";
import type { Profile } from "@/types/profile";
import { useDraggable } from "@dnd-kit/core";
import { useEffect, useEffectEvent, useRef, useState } from "react";

interface TinderCardProps {
	id: string;
	profile: Profile;
	swipeDirection: DeckSwipeDirection;
	onSwipeEnd: () => void;
	isTop: boolean;
	zIndex: number;
	onRequestSwipe: (direction: DeckSwipeDirection) => void;
}

export default function TinderCard({
	id,
	profile,
	swipeDirection,
	onSwipeEnd,
	isTop,
	zIndex,
	onRequestSwipe,
}: TinderCardProps) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id,
		disabled: !isTop,
	});

	const [exiting, setExiting] = useState(false);
	const lastPos = useRef<{ x: number; time: number }>({ x: 0, time: 0 });
	const velocity = useRef(0);

	// ✅ stable callback using useEffectEvent
	const updateVelocity = useEffectEvent((newX: number) => {
		const now = performance.now();
		const deltaX = newX - lastPos.current.x;
		const deltaT = now - lastPos.current.time;

		if (deltaT > 0) {
			velocity.current = deltaX / deltaT;
		}

		lastPos.current = { x: newX, time: now };
	});

	useEffect(() => {
		if (transform) updateVelocity(transform.x);
	}, [transform, updateVelocity]);

	useEffect(() => {
		if (swipeDirection) {
			setExiting(true);
			const timeout = setTimeout(() => {
				setExiting(false);
				onSwipeEnd();
			}, 50);
			return () => clearTimeout(timeout);
		}
	}, [onSwipeEnd, swipeDirection]);

	// Calculate rotation with Tinder-like subtle rotation
	let rotation = 0;
	if (transform) {
		// Tinder uses approximately 0.07 degrees per pixel, capped at ±20 degrees
		const rotationPerPixel = 0.07;
		const maxRotation = 20;
		rotation = transform.x * rotationPerPixel;
		// Cap the rotation to prevent excessive spinning
		rotation = Math.max(-maxRotation, Math.min(maxRotation, rotation));
	}

	let computedTransform = transform
		? `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${rotation}deg)`
		: "";

	if (exiting && swipeDirection === "left") {
		computedTransform = `translate3d(-150vw, -20px, 0) rotate(-30deg)`;
	} else if (exiting && swipeDirection === "right") {
		computedTransform = `translate3d(150vw, -20px, 0) rotate(30deg)`;
	}

	const style = {
		transform: computedTransform,
		transition: exiting
			? "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)"
			: transform
			? "none" // No transition during active drag for immediate rotation feedback
			: "transform 0.2s ease-out, opacity 0.4s ease", // Smooth return when released
		backgroundColor: "white",
		position: "absolute" as const,
		top: "50%",
		left: "50%",
		translate: "-50% -50%",
		cursor: "grab",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "1.2rem",
		fontWeight: 500,
		zIndex,
		opacity: exiting ? 0 : 1,
		transformOrigin: "center",
		scale: isTop ? 1 : 0.96,
		aspectRatio: 3 / 5,
		width: "90vw",
		maxWidth: "400px",
		height: "auto",
		minHeight: "400px",
		maxHeight: "85vh",
	};

	const handleDragEnd = useEffectEvent(() => {
		const speed = velocity.current;
		const x = lastPos.current.x;
		const absSpeed = Math.abs(speed);
		const absX = Math.abs(x);

		const VELOCITY_THRESHOLD = 0.5;
		const DISTANCE_THRESHOLD = 150;

		if (absSpeed > VELOCITY_THRESHOLD || absX > DISTANCE_THRESHOLD) {
			const direction = x < 0 ? "left" : "right";
			onRequestSwipe?.(direction);
		} else {
			onRequestSwipe?.(null);
		}
	});

	if (exiting) return null;

	// Calculate drag direction and opacity for LIKE/NOPE indicator
	const dragX = transform?.x ?? 0;
	const dragThreshold = 30; // Show indicator after dragging 30px
	const maxOpacity = 0.9;
	const shouldShowIndicator =
		Math.abs(dragX) > dragThreshold || swipeDirection !== null;
	const currentDirection =
		swipeDirection ||
		(dragX > dragThreshold ? "right" : dragX < -dragThreshold ? "left" : null);
	const indicatorOpacity = shouldShowIndicator
		? Math.min(maxOpacity, Math.abs(dragX) / 30)
		: 0;

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			onPointerUp={handleDragEnd}
			className="shadow-xs rounded-lg overflow-hidden"
		>
			{shouldShowIndicator && currentDirection && (
				<SwipeIndicator
					direction={currentDirection}
					opacity={indicatorOpacity}
				/>
			)}
			<ProfileCard profile={profile} />
		</div>
	);
}
