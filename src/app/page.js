"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamic import of the Map component to avoid SSR issues
const MapComponent = dynamic(() => import("./components/Map"), { ssr: false });

export default function Home() {
  const [coords, setCoords] = useState([
    [12.9715987, 77.5945627],
    [12.2958104, 76.6393805],
  ]); // Default coordinates
  const [input1, setInput1] = useState(coords[0]);
  const [input2, setInput2] = useState(coords[1]);

  const apiKey = "5b3ce3597851110001cf62488da057f9c35e4e16941f3b45caf0fbac"; // Add your API key here

  const handleSetCoordinates = () => {
    setCoords([input1, input2]);
  };

  return (
    <div>
      <h1>Map with Valid Route via Roads</h1>

      <div>
        <h2>Enter Coordinates</h2>
        <label>
          Start Coordinates (Latitude, Longitude):
          <input
            type="text"
            value={input1}
            onChange={(e) => setInput1(e.target.value.split(",").map(Number))}
            placeholder="e.g. 12.9716, 77.5946"
          />
        </label>
        <br />
        <label>
          End Coordinates (Latitude, Longitude):
          <input
            type="text"
            value={input2}
            onChange={(e) => setInput2(e.target.value.split(",").map(Number))}
            placeholder="e.g. 12.2958, 76.6394"
          />
        </label>
        <br />
        <button onClick={handleSetCoordinates}>Set Coordinates</button>
      </div>

      <MapComponent coordinates={coords} apiKey={apiKey} />
    </div>
  );
}
