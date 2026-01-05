'use client';

import { useState } from 'react';
import { useAircraftStore } from '@/store/aircraftStore';

interface Aircraft {
  id: string;
  registration: string;
  type: string;
  model: string;
  emptyWeight: number;
  maxTakeoffWeight: number;
  fuelCapacity: number;
  cruiseSpeed: number;
  fuelConsumption: number;
}

interface AircraftCardProps {
  aircraft: Aircraft;
  onEdit: (aircraft: Aircraft) => void;
}

export default function AircraftCard({ aircraft, onEdit }: AircraftCardProps) {
  const { deleteAircraft } = useAircraftStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteAircraft(aircraft.id);
    } catch (error) {
      console.error('Failed to delete aircraft:', error);
    }
  };

  const typeLabels: Record<string, string> = {
    SEP: 'Single Engine Piston',
    MEP: 'Multi Engine Piston',
    SET: 'Single Engine Turbine',
    MET: 'Multi Engine Turbine',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{aircraft.registration}</h3>
          <p className="text-gray-600">{aircraft.model}</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {aircraft.type}
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-4">{typeLabels[aircraft.type] || aircraft.type}</p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Empty Weight</p>
          <p className="font-semibold">{aircraft.emptyWeight} kg</p>
        </div>
        <div>
          <p className="text-gray-500">MTOW</p>
          <p className="font-semibold">{aircraft.maxTakeoffWeight} kg</p>
        </div>
        <div>
          <p className="text-gray-500">Fuel Capacity</p>
          <p className="font-semibold">{aircraft.fuelCapacity} L</p>
        </div>
        <div>
          <p className="text-gray-500">Cruise Speed</p>
          <p className="font-semibold">{aircraft.cruiseSpeed} kt</p>
        </div>
        <div>
          <p className="text-gray-500">Fuel Consumption</p>
          <p className="font-semibold">{aircraft.fuelConsumption} L/h</p>
        </div>
        <div>
          <p className="text-gray-500">Useful Load</p>
          <p className="font-semibold">{aircraft.maxTakeoffWeight - aircraft.emptyWeight} kg</p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
        <button
          onClick={() => onEdit(aircraft)}
          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        >
          Edit
        </button>
        {showDeleteConfirm ? (
          <div className="flex space-x-2">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
