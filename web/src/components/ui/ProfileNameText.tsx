import { ThemedText } from "../ThemedText";

const ProfileNameText = ({
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
			className="text-4xl font-bold"
			{...otherProps}
		>
			{children}
		</ThemedText>
	);
};

export default ProfileNameText;
