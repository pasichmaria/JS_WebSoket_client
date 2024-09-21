import { useStatistics } from "../../core";

export function StatisticsPage() {
	const {
		statistics,
		lostQuotes,
		startTime,
		calculating,
		isConnected,
		handleStart,
		handleCalculateStatistics,
		getCalculationTime,
	} = useStatistics();

	const formatStat = (value) => (value ? value.toFixed(2) : "-");

	const formatDate = (date) => {
		if (date) {
			return date.toLocaleString();
		}
		return "-";
	};

	return (
		<div className="form">
			<h2>Statistics</h2>

			<p>
				<strong>Connection Status:</strong>{" "}
				{isConnected ? "Connected" : "Disconnected"}
			</p>
			<p>
				<strong>Mean deviation:</strong> {formatStat(statistics.meanDeviation)}
			</p>
			<p>
				<strong>Standard Deviation:</strong>{" "}
				{formatStat(statistics.standardDeviation)}
			</p>
			<p>
				<strong>Median:</strong> {formatStat(statistics.median)}
			</p>
			<p>
				<strong>Mode:</strong>
				{statistics.mode !== undefined ? statistics.mode : "No mode"}
			</p>
			<p>
				<strong>Lost Quotes:</strong> {lostQuotes}
			</p>
			<p>
				<strong>Start Time:</strong> {formatDate(startTime)}
			</p>
			<p>
				<strong>Calculation Time:</strong> {getCalculationTime()}
			</p>

			<div className="button-container">
				<button type="button" onClick={handleStart} disabled={isConnected}>
					Start
				</button>
				<button
					type="button"
					onClick={handleCalculateStatistics}
					disabled={calculating}
				>
					Statistics
				</button>
			</div>
		</div>
	);
}
