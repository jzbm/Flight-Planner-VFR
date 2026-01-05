'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAircraftStore } from '@/store/aircraftStore';

export default function AircraftPage() {
  const { aircraft, isLoading, error, fetchAircraft, deleteAircraft } = useAircraftStore();

  useEffect(() => {
    fetchAircraft();
  }, [fetchAircraft]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this aircraft?')) {
      await deleteAircraft(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Aircraft</h1>
        <Link
          href="/aircraft/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add Aircraft
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {aircraft.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No aircraft yet</h3>
          <p className="text-gray-500 mb-4">Add your first aircraft to start planning flights.</p>
          <Link
            href="/aircraft/new"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Aircraft
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aircraft.map((ac) => (
            <div key={ac.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{ac.registration}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {ac.type}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Model:</span> {ac.model}</p>
                  <p><span className="font-medium">Empty Weight:</span> {ac.emptyWeight} kg</p>
                  <p><span className="font-medium">MTOW:</span> {ac.maxTakeoffWeight} kg</p>
                  <p><span className="font-medium">Fuel Capacity:</span> {ac.fuelCapacity} L</p>
                  <p><span className="font-medium">Cruise Speed:</span> {ac.cruiseSpeed} kts</p>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t flex justify-end space-x-2">
                <Link
                  href={`/aircraft/${ac.id}`}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(ac.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
