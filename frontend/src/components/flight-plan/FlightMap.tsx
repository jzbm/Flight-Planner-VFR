'use client';

import { useEffect, useRef } from 'react';
import { useFlightStore } from '@/store/flightStore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const waypointIcon = L.divIcon({
  className: 'waypoint-marker',
  html: '<div class="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function FlightMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);

  const { currentPlan, addWaypoint } = useFlightStore();
  const waypoints = currentPlan?.waypoints || [];

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Poland
    const map = L.map(mapRef.current).setView([52.0, 19.0], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add click handler for adding waypoints
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      addWaypoint({
        name: `WPT${waypoints.length + 1}`,
        latitude: Math.round(lat * 10000) / 10000,
        longitude: Math.round(lng * 10000) / 10000,
        type: 'WAYPOINT',
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers and route when waypoints change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Clear existing polyline
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (waypoints.length === 0) return;

    // Add markers for each waypoint
    const latLngs: L.LatLngExpression[] = [];

    waypoints.forEach((wp, index) => {
      const latLng: L.LatLngExpression = [wp.latitude, wp.longitude];
      latLngs.push(latLng);

      const marker = L.marker(latLng, {
        icon: waypointIcon,
      }).addTo(map);

      marker.bindPopup(`
        <div class="text-sm">
          <strong>${index + 1}. ${wp.name}</strong><br/>
          ${wp.latitude.toFixed(4)}, ${wp.longitude.toFixed(4)}
          ${wp.altitude ? `<br/>${wp.altitude} ft` : ''}
        </div>
      `);

      markersRef.current.push(marker);
    });

    // Draw route polyline
    if (latLngs.length >= 2) {
      polylineRef.current = L.polyline(latLngs, {
        color: '#2563eb',
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 10',
      }).addTo(map);
    }

    // Fit map to show all waypoints
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [waypoints]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md text-sm">
        <p className="text-gray-600">Click on map to add waypoint</p>
      </div>
      <style jsx global>{`
        .waypoint-marker {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}
