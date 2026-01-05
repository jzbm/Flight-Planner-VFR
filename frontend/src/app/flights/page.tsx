'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFlightStore } from '@/store/flightStore';
import FlightPlanCard from '@/components/flights/FlightPlanCard';

export default function FlightPlansPage() {
  const { flightPlans, fetchFlightPlans, isLoading, error } = useFlightStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFlightPlans();
  }, [fetchFlightPlans]);

  const filteredPlans = flightPlans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.departureAirportId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.arrivalAirportId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flight Plans</h1>
          <p className="text-gray-600">Manage your VFR flight plans</p>
        </div>
        <Link
          href="/flights/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          New Flight Plan
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search flight plans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No flight plans</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'No plans match your search' : 'Get started by creating a new flight plan'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Link
                href="/flights/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Flight Plan
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <FlightPlanCard key={plan.id} flightPlan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
