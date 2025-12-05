interface GradientButtonProps {
	style?: React.CSSProperties;
	color: string;
	children: React.ReactNode;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
}

const GradientButton = ({
	style,
	children,
	onClick,
	disabled,
	...rest
}: GradientButtonProps) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className="bg-linear-gradient(to right, #FF6B6B, #4ECDC4) border-none cursor-pointer disabled:cursor-not-allowed"
			style={style}
			{...rest}
		>
			{children}
		</button>
	);
};

export default GradientButton;
