import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen"; 
import "leaflet-fullscreen/dist/leaflet.fullscreen.css"; 

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapComponent = ({ onPlaceSelect }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Initialize the map
    mapRef.current = L.map("map").setView([51.505, -0.09], 13); 

    // Add tile layer
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Click event to add or move marker
    mapRef.current.on("click", (e) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]); // Move existing marker
      } else {
        // Create a new marker
        markerRef.current = L.marker([lat, lng]).addTo(mapRef.current)
          .bindPopup(`Marker at: [${lat.toFixed(5)}, ${lng.toFixed(5)}]`)
          .openPopup();
      }

      onPlaceSelect({ lat, lng });
    });

    return () => {
      mapRef.current.off(); // Clean up events
      mapRef.current.remove(); // Cleanup the map instance
    };
  }, [onPlaceSelect]);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "400px",
        backgroundColor: "lightgray", // Visible background for testing
      }}
    />
  );
};

export default MapComponent;
