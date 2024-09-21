import { Route, Routes } from "react-router-dom";
import { StatisticsPage } from "../pages/statistics/StatisticsPage";
import { Layout } from "../shared/layout/index";

function App() {
	return (
		<Layout>
			<Routes>
				<Route path="/" element={<StatisticsPage />} />
			</Routes>
		</Layout>
	);
}

export default App;
