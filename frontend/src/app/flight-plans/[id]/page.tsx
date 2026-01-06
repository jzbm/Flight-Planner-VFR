'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFlightStore } from '@/store/flightStore';
import { useAircraftStore } from '@/store/aircraftStore';
import WaypointList from '@/components/flight-plan/WaypointList';
import FlightMap from '@/components/flight-plan/FlightMap';
import FlightSummary from '@/components/flight-plan/FlightSummary';

export default function FlightPlanEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { currentPlan, fetchFlightPlan, updateFlightPlan, isLoading, error } = useFlightStore();
  const { aircraft, fetchAircraft } = useAircraftStore();
  const [name, setName] = useState('');
  const [selectedAircraftId, setSelectedAircraftId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const planId = params?.id as string;
  const isNewPlan = planId === 'new';

  useEffect(() => {
    fetchAircraft();
    if (!isNewPlan && planId) {
      fetchFlightPlan(planId);
    }
  }, [planId, isNewPlan, fetchFlightPlan, fetchAircraft]);

  useEffect(() => {
    if (currentPlan && !isNewPlan) {
      setName(currentPlan.name);
      setSelectedAircraftId(currentPlan.aircraftId || '');
    }
  }, [currentPlan, isNewPlan]);

  const handleSave = async () => {
    if (!name.trim()) return;
    
    setIsSaving(true);
    try {
      await updateFlightPlan(planId, {
        name,
        aircraftId: selectedAircraftId || undefined,
        waypoints: currentPlan?.waypoints || [],
      });
      router.push('/flight-plans');
    } catch (err) {
      console.error('Failed to save flight plan:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !isNewPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Flight Plan Name"
              className="text-xl font-semibold border-none focus:ring-0 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedAircraftId}
              onChange={(e) => setSelectedAircraftId(e.target.value)}
              className="rounded-lg border-gray-300 text-sm"
            >
              <option value="">Select Aircraft</option>
              {aircraft.map((ac) => (
                <option key={ac.id} value={ac.id}>
                  {ac.registration} - {ac.type}
                </option>
              ))}
            </select>
            <button
              onClick={handleSave}
              disabled={isSaving || !name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      <div className="grid grid-cols-12 gap-0 h-[calc(100vh-73px)]">
        <div className="col-span-3 bg-white border-r overflow-y-auto">
          <WaypointList />
        </div>
        <div className="col-span-6">
          <FlightMap />
        </div>
        <div className="col-span-3 bg-white border-l overflow-y-auto">
          <FlightSummary />
        </div>
      </div>
    </div>
  );
}
