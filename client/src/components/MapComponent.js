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

      console.log("API response data:", data); // Debugging log

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
    console.log("Submitting search query:", searchQuery); // Debugging log

    if (searchQuery) {
      geocodeLocation(searchQuery);
    } else {
      console.log("Search query is empty");
    }
  };

  return (
    <>
      {/* Search Form */}
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter a location"
          style={{ width: "80%", padding: "8px", margin: "10px" }}
        />
        {/* Changed button type to 'button' to prevent reload */}
        <button type="button" onClick={handleSearchSubmit} style={{ padding: "8px" }}>
          Search
        </button>
      </form>

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "400px",
          backgroundColor: "lightgray",
        }}
      />
    </>
  );
};

export default MapComponent;
