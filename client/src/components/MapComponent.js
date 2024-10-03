import React, { useState, useEffect } from "react";

const MapComponent = ({ onPlaceSelect }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const initializeMap = () => {
      const mapOptions = {
        center: { lat: -34.397, lng: 150.644 }, // Default location
        zoom: 8,
      };

      const googleMap = new window.google.maps.Map(document.getElementById("map"), mapOptions);

      googleMap.addListener("click", (event) => {
        const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        placeMarker(latLng, googleMap);
        onPlaceSelect(latLng); // Callback to parent with coordinates
      });

      setMap(googleMap);
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = initializeMap; // Set global init function
      document.body.appendChild(script);
    } else {
      initializeMap();
    }
  }, [onPlaceSelect]);

  const placeMarker = (location, googleMap) => {
    if (marker) {
      marker.setMap(null); // Remove the previous marker
    }
    const newMarker = new window.google.maps.Marker({
      position: location,
      map: googleMap,
    });
    setMarker(newMarker);
  };

  return <div id="map" style={{ width: "100%", height: "400px" }} />;
};

export default MapComponent;
