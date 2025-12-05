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
				fontFamily: "'Source Sans Pro', sans-serif",
			}}
			className="text-5xl font-bold"
			{...otherProps}
		>
			{children}
		</ThemedText>
	);
};

export default AppHeaderText;
