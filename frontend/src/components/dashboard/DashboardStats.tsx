'use client';

import { useFlightStore } from '@/store/flightStore';
import { useAircraftStore } from '@/store/aircraftStore';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardStats() {
  const { flightPlans } = useFlightStore();
  const { aircraft } = useAircraftStore();

  const totalFlights = flightPlans.length;
  const totalAircraft = aircraft.length;
  const totalDistance = flightPlans.reduce((sum, fp) => sum + (fp.totalDistance || 0), 0);
  const totalHours = flightPlans.reduce((sum, fp) => sum + (fp.estimatedTime || 0), 0) / 60;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Flight Plans"
        value={totalFlights}
        color="bg-blue-100 text-blue-600"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        }
      />
      <StatCard
        title="Aircraft"
        value={totalAircraft}
        color="bg-green-100 text-green-600"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
          </svg>
        }
      />
      <StatCard
        title="Total Distance"
        value={`${totalDistance.toFixed(0)} NM`}
        color="bg-purple-100 text-purple-600"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
      />
      <StatCard
        title="Flight Hours"
        value={`${totalHours.toFixed(1)} h`}
        color="bg-orange-100 text-orange-600"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  );
}
