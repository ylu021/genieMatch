import TinderDeck from "@/components/TinderDeck";

const backgroundImage = "/images/main-background3.png";

export default function Main() {
	return (
		<div
			style={{
				width: "100vw",
				height: "100vh",
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundColor: "black",
				position: "relative",
			}}
		>
			<TinderDeck />
		</div>
	);
}
