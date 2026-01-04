'use client';

import Link from 'next/link';
import { useFlightStore } from '@/store/flightStore';

export default function RecentFlights() {
  const { flightPlans } = useFlightStore();
  
  const recentPlans = flightPlans.slice(0, 5);

  if (recentPlans.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Flight Plans</h2>
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500">No flight plans yet</p>
          <Link
            href="/flight-plans/new"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create your first flight plan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Flight Plans</h2>
        <Link href="/flight-plans" className="text-sm text-blue-600 hover:text-blue-700">
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {recentPlans.map((plan) => (
          <Link
            key={plan.id}
            href={`/flight-plans/${plan.id}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {plan.waypoints?.length || 0} waypoints
                  {plan.totalDistance && ` • ${plan.totalDistance.toFixed(0)} NM`}
                  {plan.estimatedTime && ` • ${Math.round(plan.estimatedTime)} min`}
                </p>
              </div>
              <div className="text-sm text-gray-400">
                {new Date(plan.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
