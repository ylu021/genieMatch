import { useEffect, useState } from "react";

export function useColorScheme(): "light" | "dark" {
	const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");

	useEffect(() => {
		// Default to dark theme, ignore system preference
		setColorScheme("dark");
	}, []);

	return colorScheme;
}
