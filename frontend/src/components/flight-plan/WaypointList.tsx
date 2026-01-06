'use client';

import { useFlightStore } from '@/store/flightStore';
import { useState } from 'react';

interface WaypointFormData {
  name: string;
  latitude: string;
  longitude: string;
  altitude: string;
  type: string;
}

const initialFormData: WaypointFormData = {
  name: '',
  latitude: '',
  longitude: '',
  altitude: '',
  type: 'WAYPOINT',
};

export default function WaypointList() {
  const { currentPlan, addWaypoint, removeWaypoint, updateWaypoint, reorderWaypoints } = useFlightStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<WaypointFormData>(initialFormData);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const waypoints = currentPlan?.waypoints || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const waypoint = {
      name: formData.name,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      altitude: formData.altitude ? parseInt(formData.altitude) : undefined,
      type: formData.type,
    };

    if (editIndex !== null) {
      updateWaypoint(editIndex, waypoint);
      setEditIndex(null);
    } else {
      addWaypoint(waypoint);
    }

    setFormData(initialFormData);
    setShowForm(false);
  };

  const handleEdit = (index: number) => {
    const wp = waypoints[index];
    setFormData({
      name: wp.name,
      latitude: wp.latitude.toString(),
      longitude: wp.longitude.toString(),
      altitude: wp.altitude?.toString() || '',
      type: wp.type,
    });
    setEditIndex(index);
    setShowForm(true);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderWaypoints(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < waypoints.length - 1) {
      reorderWaypoints(index, index + 1);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Waypoints</h3>
        <button
          onClick={() => {
            setShowForm(true);
            setEditIndex(null);
            setFormData(initialFormData);
          }}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          + Add
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="space-y-3">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Waypoint name"
              className="w-full text-sm rounded border-gray-300"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="Latitude"
                className="text-sm rounded border-gray-300"
                required
              />
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="Longitude"
                className="text-sm rounded border-gray-300"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={formData.altitude}
                onChange={(e) => setFormData({ ...formData, altitude: e.target.value })}
                placeholder="Altitude (ft)"
                className="text-sm rounded border-gray-300"
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="text-sm rounded border-gray-300"
              >
                <option value="WAYPOINT">Waypoint</option>
                <option value="AIRPORT">Airport</option>
                <option value="VOR">VOR</option>
                <option value="NDB">NDB</option>
                <option value="FIX">Fix</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                {editIndex !== null ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditIndex(null);
                }}
                className="px-3 py-1.5 text-gray-600 text-sm rounded hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {waypoints.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No waypoints yet. Click &quot;+ Add&quot; to create one.
          </p>
        ) : (
          waypoints.map((wp, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-white border rounded-lg hover:border-blue-300"
            >
              <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{wp.name}</p>
                <p className="text-xs text-gray-500">
                  {wp.latitude.toFixed(4)}, {wp.longitude.toFixed(4)}
                  {wp.altitude && ` · ${wp.altitude} ft`}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === waypoints.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleEdit(index)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => removeWaypoint(index)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
