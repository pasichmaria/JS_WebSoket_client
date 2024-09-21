# React + Vite

This project is a React SPA that connects to a WebSocket for receiving live trading quotes and calculates real-time statistics. The application is designed for high performance, handling large volumes of data, and provides key statistical insights such as average,
standard deviation, mode, and median for the received data.

Live Trading Quotes: Connects to a WebSocket at
Statistical Calculations: Calculates the following statistical metrics based on the received data:
1. [x] Average
2. [x] Standard deviation
3. [x] Mode (single mode in case of multimodality)
4. [x] Median
5. [x] Lost quotes count (if any)
6. [x] Calculation time


Optimized Performance: Handles large datasets
(up to trillions of data points) and performs calculations within 1 second.
User-friendly Interface: Includes a clean UI with "Start" and "Statistics" buttons for controlling the connection and displaying statistics


## Technologies
- React
- Vite
- WebSocket
- CSS 
- JavaScript

## Installation
1. Clone the repository
2. Install dependencies
```bash
  pnpm install
```
3. Start the development server
```bash
  pnpm run dev
```
4. Open the browser and navigate to `http://localhost:3000/`
5. Click the "Start" button to connect to the WebSocket and start receiving live trading quotes
6. Click the "Statistics" button to display the calculated statistics



