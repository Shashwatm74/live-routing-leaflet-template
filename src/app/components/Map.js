import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios from "axios";

// Leaflet icon fix for missing default marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapComponent = ({ coordinates, apiKey }) => {
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (coordinates.length === 2) {
      getRoute(coordinates);
    }
  }, [coordinates]);

  // Function to fetch the route from OpenRouteService API
  const getRoute = async (coords) => {
    const [start, end] = coords;

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;

    try {
      const response = await axios.get(url);
      const routeCoordinates =
        response.data.features[0].geometry.coordinates.map(([lon, lat]) => [
          lat,
          lon,
        ]);
      setRoute(routeCoordinates);

      // Get the total distance from the API response (in meters)
      const distanceInMeters =
        response.data.features[0].properties.segments[0].distance;
      setDistance((distanceInMeters / 1000).toFixed(2)); // Convert to km and round to 2 decimal places
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return (
    <div>
      <MapContainer
        center={coordinates[0]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Start and End markers */}
        {coordinates.map((coord, index) => (
          <Marker key={index} position={coord}></Marker>
        ))}

        {/* Polyline for the route */}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>

      {/* Display the distance */}
      {distance > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h3>Distance between points (via roads): {distance} km</h3>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
