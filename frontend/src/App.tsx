import { Route, Routes, BrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { UsersPage } from "./pages/UsersPage";
import { VacationsPage } from "./pages/VacationsPage";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<HomePage />} />
						<Route path="users" element={<UsersPage />} />
						<Route path="vacations" element={<VacationsPage />} />
						<Route path="*" element={<h1>Страница не найдена</h1>} />
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
