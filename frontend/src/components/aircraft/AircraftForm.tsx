'use client';

import { useState } from 'react';
import { useAircraftStore } from '@/store/aircraftStore';

interface AircraftFormProps {
  aircraft?: any;
  onClose: () => void;
}

export default function AircraftForm({ aircraft, onClose }: AircraftFormProps) {
  const { createAircraft, updateAircraft, isLoading } = useAircraftStore();
  const isEditing = !!aircraft;

  const [formData, setFormData] = useState({
    registration: aircraft?.registration || '',
    type: aircraft?.type || '',
    model: aircraft?.model || '',
    emptyWeight: aircraft?.emptyWeight || '',
    maxTakeoffWeight: aircraft?.maxTakeoffWeight || '',
    fuelCapacity: aircraft?.fuelCapacity || '',
    cruiseSpeed: aircraft?.cruiseSpeed || '',
    fuelConsumption: aircraft?.fuelConsumption || '',
    emptyWeightArm: aircraft?.emptyWeightArm || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      emptyWeight: parseFloat(formData.emptyWeight),
      maxTakeoffWeight: parseFloat(formData.maxTakeoffWeight),
      fuelCapacity: parseFloat(formData.fuelCapacity),
      cruiseSpeed: parseFloat(formData.cruiseSpeed),
      fuelConsumption: parseFloat(formData.fuelConsumption),
      emptyWeightArm: parseFloat(formData.emptyWeightArm),
    };

    try {
      if (isEditing) {
        await updateAircraft(aircraft.id, data);
      } else {
        await createAircraft(data);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save aircraft:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? 'Edit Aircraft' : 'Add New Aircraft'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Registration</label>
            <input
              type="text"
              name="registration"
              value={formData.registration}
              onChange={handleChange}
              required
              placeholder="SP-ABC"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="SEP">SEP - Single Engine Piston</option>
              <option value="MEP">MEP - Multi Engine Piston</option>
              <option value="SET">SET - Single Engine Turbine</option>
              <option value="MET">MET - Multi Engine Turbine</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              placeholder="Cessna 172"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Empty Weight (kg)</label>
              <input
                type="number"
                name="emptyWeight"
                value={formData.emptyWeight}
                onChange={handleChange}
                required
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">MTOW (kg)</label>
              <input
                type="number"
                name="maxTakeoffWeight"
                value={formData.maxTakeoffWeight}
                onChange={handleChange}
                required
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fuel Capacity (L)</label>
              <input
                type="number"
                name="fuelCapacity"
                value={formData.fuelCapacity}
                onChange={handleChange}
                required
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cruise Speed (kt)</label>
              <input
                type="number"
                name="cruiseSpeed"
                value={formData.cruiseSpeed}
                onChange={handleChange}
                required
                step="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fuel Consumption (L/h)</label>
              <input
                type="number"
                name="fuelConsumption"
                value={formData.fuelConsumption}
                onChange={handleChange}
                required
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Empty Weight Arm (mm)</label>
              <input
                type="number"
                name="emptyWeightArm"
                value={formData.emptyWeightArm}
                onChange={handleChange}
                required
                step="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
