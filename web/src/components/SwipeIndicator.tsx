import { motion } from "framer-motion";
import type { DeckSwipeDirection } from "@/types/deckSwipeActions";

interface SwipeIndicatorProps {
	direction: DeckSwipeDirection;
	opacity: number;
}

export default function SwipeIndicator({ direction, opacity }: SwipeIndicatorProps) {
	return (
		<motion.div
			key={direction}
			initial={{ scale: 0.6, opacity: 0 }}
			animate={{
				scale: 1,
				opacity: opacity,
			}}
			exit={{ scale: 0.6, opacity: 0 }}
			transition={{ duration: 0.15 }}
			className={`
				absolute top-1/4 z-10
				${
					direction === "right"
						? "left-8 text-green-400 border-green-400 -rotate-12"
						: "right-8 text-red-400 border-red-400 rotate-12"
				}
				top-[25%] border-[6px] font-black text-4xl sm:text-5xl uppercase px-6 py-3 rounded-xl
				backdrop-blur-sm bg-white/30 shadow-[0_0_25px_rgba(0,0,0,0.5)] transition-all duration-75
			`}
		>
			{direction === "right" ? "LIKE" : "NOPE"}
		</motion.div>
	);
}

