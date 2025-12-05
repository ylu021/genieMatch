import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Main from "./pages/Main";
import NotFound from "./pages/NotFound";
import OnboardingPersonalityStep from "./pages/OnboardingPersonalityStep";

function App() {
	return (
		<div className="h-screen w-screen overflow-hidden">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/main" element={<Main />} />
					<Route
						path="/onboarding/personality"
						element={<OnboardingPersonalityStep />}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
