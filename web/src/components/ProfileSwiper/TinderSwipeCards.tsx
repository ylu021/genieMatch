import React, { useState, useRef } from "react";
import {
	motion,
	useMotionValue,
	useTransform,
	useAnimation,
} from "framer-motion";
import PROFILES from "@/constants/profile.json";
import ICONS from "@/constants/icons";
import { ThemedText } from "@/components/ThemedText";
import getProfileImage from "@/utils/getProfileImage";
import ProfileCard from "@/components/ProfileCard";
import Overlay from "@/components/Overlay";

function IconButton({ icon: Icon, color, size, onClick, disabled }) {
	return (
		<motion.button
			whileTap={{ scale: 0.9 }}
			onClick={onClick}
			disabled={disabled}
			className={`rounded-full shadow-xl flex items-center justify-center transition-all ${
				disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
			}`}
			style={{
				width: size * 1.8,
				height: size * 1.8,
				backgroundColor:
					color === "gray"
						? "#6B7280"
						: color === "orange"
						? "#F97316"
						: "#EF4444",
			}}
		>
			<Icon size={size} color="white" strokeWidth={2.5} />
		</motion.button>
	);
}

export default function ProfileSwiper() {
	const [cards, setCards] = useState(PROFILES);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [triggerSwipe, setTriggerSwipe] = useState(null);
	const [lastAction, setLastAction] = useState(null);

	const handleSwipe = (direction) => {
		const actions = {
			left: { text: "Passed", emoji: "❌", value: -1 },
			down: { text: "Super Liked", emoji: "⭐", value: 1 },
			right: { text: "Liked", emoji: "❤️", value: 2 },
		};

		setLastAction(actions[direction]);

		setTimeout(() => {
			setCurrentIndex((prev) => (prev + 1) % PROFILES.length);
			setTriggerSwipe(null);
		}, 300);
	};

	const handleIconClick = (direction) => {
		if (currentIndex < cards.length) {
			setTriggerSwipe({ direction, timestamp: Date.now() });
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-4 border border-red">
			<Overlay darkerOverlay />
			{/* Cards Container */}
			<div className="relative w-full max-w-sm text-white border border-white basis-xl">
				{PROFILES.slice(0, 1).map((user, index) => (
					<ProfileCard
						key={user.id}
						user={user}
						index={index}
						isTop={index === 0}
						onSwipe={handleSwipe}
						triggerSwipe={index === 0 ? triggerSwipe : null}
					/>
				))}
			</div>

			{/* Action Buttons */}
			{/* <div className="z-10 flex gap-6 mb-4 items-center basis-auto border border-white">
				{ICONS.map((icon) => (
					<IconButton
						key={icon.id}
						icon={icon.Icon}
						color={icon.color}
						size={icon.size}
						onClick={() => handleIconClick(icon.direction)}
						disabled={currentIndex >= cards.length}
					/>
				))}
			</div> */}

			{/* Last Action */}
			{/* {lastAction && (
				<div className="text-gray-700 text-lg font-medium animate-pulse">
					{lastAction.emoji} {lastAction.text}
				</div>
			)} */}
		</div>
	);
}
