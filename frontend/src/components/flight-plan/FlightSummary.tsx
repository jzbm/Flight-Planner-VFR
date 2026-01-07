'use client';

import { useMemo } from 'react';
import { useFlightStore } from '@/store/flightStore';

export default function FlightSummary() {
  const { currentPlan } = useFlightStore();
  const waypoints = currentPlan?.waypoints || [];

  const calculations = useMemo(() => {
    if (waypoints.length < 2) {
      return { totalDistance: 0, legs: [] };
    }

    const legs: { from: string; to: string; distance: number; bearing: number }[] = [];
    let totalDistance = 0;

    for (let i = 0; i < waypoints.length - 1; i++) {
      const from = waypoints[i];
      const to = waypoints[i + 1];

      // Haversine formula for distance
      const R = 3440.065; // Earth radius in nautical miles
      const lat1 = (from.latitude * Math.PI) / 180;
      const lat2 = (to.latitude * Math.PI) / 180;
      const dLat = lat2 - lat1;
      const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      // Calculate bearing
      const y = Math.sin(dLon) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
      let bearing = (Math.atan2(y, x) * 180) / Math.PI;
      bearing = (bearing + 360) % 360;

      legs.push({
        from: from.name,
        to: to.name,
        distance: Math.round(distance * 10) / 10,
        bearing: Math.round(bearing),
      });

      totalDistance += distance;
    }

    return { totalDistance: Math.round(totalDistance * 10) / 10, legs };
  }, [waypoints]);

  const formatTime = (distanceNm: number, speedKts: number = 100) => {
    const hours = distanceNm / speedKts;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Flight Summary</h3>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-blue-600 uppercase tracking-wide">Total Distance</p>
          <p className="text-xl font-bold text-blue-900">{calculations.totalDistance} NM</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-green-600 uppercase tracking-wide">Est. Time (100kt)</p>
          <p className="text-xl font-bold text-green-900">{formatTime(calculations.totalDistance)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-xs text-purple-600 uppercase tracking-wide">Waypoints</p>
          <p className="text-xl font-bold text-purple-900">{waypoints.length}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3">
          <p className="text-xs text-orange-600 uppercase tracking-wide">Legs</p>
          <p className="text-xl font-bold text-orange-900">{calculations.legs.length}</p>
        </div>
      </div>

      {calculations.legs.length > 0 && (
        <>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Route Legs</h4>
          <div className="space-y-2">
            {calculations.legs.map((leg, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-3 text-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">
                    {leg.from} → {leg.to}
                  </span>
                  <span className="text-gray-500">Leg {index + 1}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    {leg.distance} NM
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {leg.bearing}°
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTime(leg.distance)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {waypoints.length < 2 && (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-sm">Add at least 2 waypoints to see flight calculations</p>
        </div>
      )}
    </div>
  );
}
