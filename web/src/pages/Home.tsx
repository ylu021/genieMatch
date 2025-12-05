import { AppHeaderText, ThemedText, Button } from "@/components";

const backgroundImage = "/images/main-background3.png";

export default function Home() {
	return (
		<section
			className="w-screen h-screen flex flex-col gap-4 justify-around items-center p-4 relative"
			style={{
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			{/* <Overlay className="absolute inset-0 z-0" /> */}
			<section className="z-10 flex flex-col justify-end basis-sm items-center">
				<AppHeaderText lightColor="white" darkColor="white">
					GenieMatch
				</AppHeaderText>
				<ThemedText as="p" lightColor="white" className="max-w-2/3">
					Tired of swiping? Find your soulmate with GenieMatch—only hearts that
					rhyme in harmony.{" "}
				</ThemedText>
			</section>
			<section className="z-10 flex flex-col gap-4 items-center justify-center mt-10 basis-auto">
				<Button href="/main" onPress={() => {}}>
					<ThemedText
						style={{
							fontFamily: "'Open Sans', sans-serif",
							fontWeight: "700",
						}}
					>
						Begin Your Journey
					</ThemedText>
				</Button>
				<Button href="/onboarding/personality" onPress={() => {}}>
					<ThemedText
						style={{
							fontFamily: "'Open Sans', sans-serif",
							fontWeight: "700",
						}}
					>
						Sign Up
					</ThemedText>
				</Button>
			</section>

			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "rgba(0, 0, 0, 0.1)",
				}}
			/>
		</section>
	);
}
