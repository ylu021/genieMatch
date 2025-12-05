import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Main from "./pages/Main";
import NotFound from "./pages/NotFound";

function App() {
	return (
		<div className="h-screen w-screen overflow-hidden">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/main" element={<Main />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
