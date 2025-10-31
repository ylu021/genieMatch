import { ThemedText } from "../ThemedText";

const AppHeaderText = ({
	children,
	...otherProps
}: {
	children: React.ReactNode;
	lightColor?: string;
	darkColor?: string;
}) => {
	return (
		<ThemedText
			style={{
				fontSize: "46px",
				fontFamily: "'Source Sans Pro', sans-serif",
				fontWeight: "700",
				lineHeight: "60px",
			}}
			{...otherProps}
		>
			{children}
		</ThemedText>
	);
};

export default AppHeaderText;
