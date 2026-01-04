'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/authStore';
import { useFlightStore } from '@/store/flightStore';
import { useAircraftStore } from '@/store/aircraftStore';

function DashboardContent() {
  const { user } = useAuthStore();
  const { flightPlans, fetchFlightPlans, isLoading: flightsLoading } = useFlightStore();
  const { aircraft, fetchAircraft, isLoading: aircraftLoading } = useAircraftStore();

  useEffect(() => {
    fetchFlightPlans();
    fetchAircraft();
  }, [fetchFlightPlans, fetchAircraft]);

  const recentPlans = flightPlans.slice(0, 5);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.firstName || 'Pilot'}!
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Here&apos;s an overview of your flight planning activities.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Flight Plans</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {flightsLoading ? '...' : flightPlans.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Aircraft</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {aircraftLoading ? '...' : aircraft.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Flight Time</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {flightPlans.reduce((acc, p) => acc + (p.estimatedTime || 0), 0)} min
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Distance</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {flightPlans.reduce((acc, p) => acc + (p.totalDistance || 0), 0).toFixed(0)} NM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Plans */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/flight-plans/new"
                  className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">New Flight Plan</span>
                </Link>
                <Link
                  href="/aircraft"
                  className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span className="text-green-700 dark:text-green-300 font-medium">Manage Aircraft</span>
                </Link>
                <Link
                  href="/weather"
                  className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                >
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  <span className="text-yellow-700 dark:text-yellow-300 font-medium">Check Weather</span>
                </Link>
                <Link
                  href="/calculator"
                  className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-purple-700 dark:text-purple-300 font-medium">Navigation Calculator</span>
                </Link>
              </div>
            </div>

            {/* Recent Flight Plans */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Flight Plans</h2>
                <Link href="/flight-plans" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View all
                </Link>
              </div>
              
              {flightsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : recentPlans.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No flight plans yet.</p>
                  <Link href="/flight-plans/new" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                    Create your first flight plan
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPlans.map((plan) => (
                    <Link
                      key={plan.id}
                      href={`/flight-plans/${plan.id}`}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{plan.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {plan.waypoints?.length || 0} waypoints | {plan.totalDistance?.toFixed(1) || 0} NM
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
