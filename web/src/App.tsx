import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Main from "./pages/Main";
import Preferences from "./pages/Preferences";
import Bio from "./pages/Bio";
import NotFound from "./pages/NotFound";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/main" element={<Main />} />
				<Route path="/preferences" element={<Preferences />} />
				<Route path="/bio" element={<Bio />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
