import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl"; 
import "maplibre-gl/dist/maplibre-gl.css"; // Ensure CSS is imported

const MapComponent = ({ onPlaceSelect }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null); // Ref to store the map instance
  const markerRef = useRef(null); // Ref to store the marker instance

  const [selectedLocation, setSelectedLocation] = useState({
    lng: -0.09, // Initial longitude (City of London)
    lat: 51.505, // Initial latitude (City of London)
    zoom: 13,    // Initial zoom level
  });

  const [searchQuery, setSearchQuery] = useState(""); // For location search input

  // Geocoding function using OpenStreetMap Nominatim API
  const geocodeLocation = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        setSelectedLocation({ lng: longitude, lat: latitude, zoom: 13 });

        // Update the marker position
        if (markerRef.current) {
          markerRef.current.setLngLat([longitude, latitude]);
        } else {
          markerRef.current = new maplibregl.Marker({
            color: "#FF0000", // Red marker for visibility
          })
            .setLngLat([longitude, latitude])
            .addTo(mapRef.current);
        }

        // Pass the selected location to parent component
        onPlaceSelect({ lng: longitude, lat: latitude });
      } else {
        alert("Location not found!");
      }
    } catch (error) {
      console.error("Error with geocoding:", error);
      alert("Error finding the location.");
    }
  };

  useEffect(() => {
    // Initialize the map once
    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            "raster-tiles": {
              type: "raster",
              tiles: [
                "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors',
            },
          },
          layers: [
            {
              id: "raster-tiles",
              type: "raster",
              source: "raster-tiles",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [selectedLocation.lng, selectedLocation.lat], // Initial center
        zoom: selectedLocation.zoom, // Initial zoom
      });

      // Add full-screen control to the map
      mapRef.current.addControl(new maplibregl.FullscreenControl());

      // Handle map clicks to place or move the marker
      mapRef.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;

        // If marker exists, move it; otherwise, create a new marker
        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        } else {
          markerRef.current = new maplibregl.Marker({
            color: "#FF0000", // Red marker for visibility
          })
            .setLngLat([lng, lat])
            .addTo(mapRef.current);
        }

        // Update the selected location
        setSelectedLocation({ lng, lat, zoom: mapRef.current.getZoom() });

        // Pass selected location to the callback
        onPlaceSelect({ lng, lat });
      });
    }
  }, [onPlaceSelect]);

  useEffect(() => {
    // Update map center if selectedLocation changes
    if (mapRef.current) {
      mapRef.current.setCenter([selectedLocation.lng, selectedLocation.lat]);
    }
  }, [selectedLocation]);

  // Handle form submission for location search
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    if (searchQuery) {
      geocodeLocation(searchQuery);
    }
  };

  return (
    <>
      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter a location"
          style={{
            width: "80%",
            padding: "8px 40px 8px 8px", // Padding on the right to accommodate the icon
            margin: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        {/* Search icon inside the input */}
        <button
          type="button"
          onClick={handleSearchSubmit}
          style={{
            position: "absolute",
            right: "10%",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-search"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "400px", // Adjust height as needed
          backgroundColor: "lightgray",
        }}
      />
    </>
  );
};

export default MapComponent;
