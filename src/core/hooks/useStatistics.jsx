import {useCallback, useRef, useState} from "react";

const RECONNECT_INTERVAL = 5000;
const MAX_RECONNECT_ATTEMPTS = 10;

export const useStatistics = () => {
	const [statistics, setStatistics] = useState({});
	const [startTime, setStartTime] = useState(null);
	const [startCalculationTime, setStartCalculationTime] = useState(null);
	const [endCalculationTime, setEndCalculationTime] = useState(null);
	const [lostQuotes, setLostQuotes] = useState(0);
	const [calculating, setCalculating] = useState(false);
	const [isConnected, setIsConnected] = useState(false);

	const reconnectAttempts = useRef(0);
	const statsRef = useRef({
		mean: 0,
		m2: 0,
		count: 0,
		modeMap: {},
		mode: null,
		lowHeap: [],
		highHeap: [],
	});

	const socketRef = useRef(null);

	const updateRunningMeanAndVariance = useCallback((n, mean, m2, newValue) => {
		const delta = newValue - mean;
		const newMean = mean + delta / n;
		const delta2 = newValue - newMean;
		const newM2 = m2 + delta * delta2;
		return { mean: newMean, m2: newM2 };
	}, []);

	const insertHeap = useCallback((num, lowHeap, highHeap) => {
		if (lowHeap.length === 0 || num < -lowHeap[0]) {
			lowHeap.push(-num);
			lowHeap.sort((a, b) => a - b);
		} else {
			highHeap.push(num);
			highHeap.sort((a, b) => a - b);
		}

		if (lowHeap.length > highHeap.length + 1) {
			highHeap.push(-lowHeap.shift());
		} else if (highHeap.length > lowHeap.length) {
			lowHeap.push(-highHeap.shift());
		}
	}, []);

	const processNewData = useCallback(
		(value) => {
			const stats = statsRef.current;
			stats.count += 1;
			const { mean, m2 } = updateRunningMeanAndVariance(
				stats.count,
				stats.mean,
				stats.m2,
				value,
			);
			stats.mean = mean;
			stats.m2 = m2;
			insertHeap(value, stats.lowHeap, stats.highHeap);
			stats.modeMap[value] = (stats.modeMap[value] || 0) + 1;
			if (!stats.mode || stats.modeMap[value] > stats.modeMap[stats.mode]) {
				stats.mode = value;
			}
		},
		[updateRunningMeanAndVariance, insertHeap],
	);

	const connectWebSocket = useCallback(() => {
		if (socketRef.current) {
			socketRef.current.close();
		}

		const ws = new WebSocket("wss://trade.termplat.com:8800/?password=1234");

		ws.onopen = () => {
			setIsConnected(true);
			reconnectAttempts.current = 0;
		};

		ws.onmessage = (event) => {
			const newData = JSON.parse(event.data);
			if (newData.value) {
				processNewData(newData.value);
			} else {
				setLostQuotes((prev) => prev + 1);
			}
		};

		ws.onclose = () => {
			setIsConnected(false);
			if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
				reconnectAttempts.current += 1;
				setTimeout(connectWebSocket, RECONNECT_INTERVAL);
			}
		};

		ws.onerror = (error) => {
			console.error("WebSocket error: ", error);
			ws.close();
		};

		socketRef.current = ws;
	}, [processNewData]);

	const handleStart = () => {
		setStatistics({});
		setStartTime(new Date());
		setStartCalculationTime(null);
		setEndCalculationTime(null);
		setLostQuotes(0);
		statsRef.current = {
			mean: 0,
			m2: 0,
			count: 0,
			modeMap: {},
			mode: null,
			lowHeap: [],
			highHeap: [],
		};
		connectWebSocket();
	};

	const handleCalculateStatistics = () => {
		if (!isConnected) return alert("Please start the connection first");
		setStartCalculationTime(new Date());
		setCalculating(true);
		try {
			const stats = statsRef.current;
			const variance = stats.count > 1 ? stats.m2 / stats.count : 0;
			const standardDeviation = Math.sqrt(variance);
			const median = getMedian(stats.lowHeap, stats.highHeap);

			setStatistics({
				meanDeviation: stats.mean,
				standardDeviation: standardDeviation,
				median: median,
				mode: stats.mode,
			});
		} catch (error) {
			setLostQuotes((prev) => prev + 1);
		}
		setEndCalculationTime(new Date());
		setCalculating(false);
	};

	const getCalculationTime = () => {
		if (startCalculationTime && endCalculationTime) {
			return `${endCalculationTime - startCalculationTime} miliseconds`;
		}
		return "-";
	};

	return {
		statistics,
		lostQuotes,
		startTime,
		calculating,
		isConnected,
		handleStart,
		handleCalculateStatistics,
		getCalculationTime,
	};
};

export default useStatistics;

function getMedian(lowHeap, highHeap) {
	if (lowHeap.length === highHeap.length) {
		return (-lowHeap[0] + highHeap[0]) / 2;
	}
	return -lowHeap[0];
}
