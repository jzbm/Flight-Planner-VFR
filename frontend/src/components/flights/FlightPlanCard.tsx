'use client';

import Link from 'next/link';
import { useFlightStore } from '@/store/flightStore';
import { useState } from 'react';

interface FlightPlan {
  id: string;
  name: string;
  departureAirportId?: string;
  arrivalAirportId?: string;
  totalDistance?: number;
  estimatedTime?: number;
  fuelRequired?: number;
  createdAt: string;
  aircraft?: {
    registration: string;
    model: string;
  };
}

interface FlightPlanCardProps {
  flightPlan: FlightPlan;
}

export default function FlightPlanCard({ flightPlan }: FlightPlanCardProps) {
  const { deleteFlightPlan } = useFlightStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteFlightPlan(flightPlan.id);
    } catch (error) {
      console.error('Failed to delete flight plan:', error);
    }
  };

  const formatTime = (minutes?: number) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900">{flightPlan.name}</h3>
        <span className="text-sm text-gray-500">{formatDate(flightPlan.createdAt)}</span>
      </div>

      <div className="flex items-center justify-center mb-4 py-3 bg-gray-50 rounded-md">
        <div className="text-center">
          <p className="text-xl font-bold text-blue-600">
            {flightPlan.departureAirportId || '----'}
          </p>
          <p className="text-xs text-gray-500">DEP</p>
        </div>
        <div className="mx-4 flex items-center">
          <div className="w-8 h-px bg-gray-300"></div>
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
          <div className="w-8 h-px bg-gray-300"></div>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-blue-600">
            {flightPlan.arrivalAirportId || '----'}
          </p>
          <p className="text-xs text-gray-500">ARR</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
        <div className="text-center">
          <p className="text-gray-500">Distance</p>
          <p className="font-semibold">
            {flightPlan.totalDistance ? `${flightPlan.totalDistance.toFixed(1)} NM` : '-'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Time</p>
          <p className="font-semibold">{formatTime(flightPlan.estimatedTime)}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Fuel</p>
          <p className="font-semibold">
            {flightPlan.fuelRequired ? `${flightPlan.fuelRequired.toFixed(1)} L` : '-'}
          </p>
        </div>
      </div>

      {flightPlan.aircraft && (
        <div className="text-sm text-gray-600 mb-4">
          <span className="font-medium">{flightPlan.aircraft.registration}</span>
          <span className="mx-2">·</span>
          <span>{flightPlan.aircraft.model}</span>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <Link
          href={`/flights/${flightPlan.id}`}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          View Details
        </Link>
        <div className="flex space-x-2">
          <Link
            href={`/flights/${flightPlan.id}/edit`}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Edit
          </Link>
          {showDeleteConfirm ? (
            <div className="flex space-x-2">
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
