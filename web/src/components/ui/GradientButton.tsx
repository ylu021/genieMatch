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
			style={{
				background: "linear-gradient(to right, #EC4899, #8B5CF6)",
				border: "none",
				cursor: disabled ? "not-allowed" : "pointer",
				...style,
			}}
			{...rest}
		>
			{children}
		</button>
	);
};

export default GradientButton;
