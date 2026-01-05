'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface WeightBalanceProps {
  aircraftId: string;
  aircraft: {
    emptyWeight: number;
    maxTakeoffWeight: number;
    model: string;
  };
}

interface WeightBalanceResult {
  totalWeight: number;
  centerOfGravity: number;
  maxTakeoffWeight: number;
  isWithinWeightLimits: boolean;
  isWithinCGEnvelope: boolean;
  cgEnvelope: { weight: number; arm: number }[];
  currentPosition: { weight: number; arm: number };
}

export default function WeightBalanceCalculator({ aircraftId, aircraft }: WeightBalanceProps) {
  const [input, setInput] = useState({
    pilotWeight: 80,
    coPilotWeight: 0,
    rearPassengersWeight: 0,
    baggageWeight: 0,
    fuelWeight: 100,
  });

  const [result, setResult] = useState<WeightBalanceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const calculateWeightBalance = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(`/aircraft/${aircraftId}/weight-balance`, input);
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Calculation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const totalInputWeight = 
    aircraft.emptyWeight + 
    input.pilotWeight + 
    input.coPilotWeight + 
    input.rearPassengersWeight + 
    input.baggageWeight + 
    input.fuelWeight;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Weight & Balance Calculator</h3>
      <p className="text-sm text-gray-500 mb-4">{aircraft.model}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pilot (kg)</label>
          <input
            type="number"
            name="pilotWeight"
            value={input.pilotWeight}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Co-Pilot (kg)</label>
          <input
            type="number"
            name="coPilotWeight"
            value={input.coPilotWeight}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rear Passengers (kg)</label>
          <input
            type="number"
            name="rearPassengersWeight"
            value={input.rearPassengersWeight}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Baggage (kg)</label>
          <input
            type="number"
            name="baggageWeight"
            value={input.baggageWeight}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Fuel (kg)</label>
          <input
            type="number"
            name="fuelWeight"
            value={input.fuelWeight}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-4 p-4 bg-gray-50 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Estimated Total Weight:</span>
          <span className={`font-bold ${totalInputWeight > aircraft.maxTakeoffWeight ? 'text-red-600' : 'text-green-600'}`}>
            {totalInputWeight.toFixed(1)} kg
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">MTOW:</span>
          <span className="font-medium">{aircraft.maxTakeoffWeight} kg</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className={`h-2 rounded-full ${totalInputWeight > aircraft.maxTakeoffWeight ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min((totalInputWeight / aircraft.maxTakeoffWeight) * 100, 100)}%` }}
          />
        </div>
      </div>

      <button
        onClick={calculateWeightBalance}
        disabled={isLoading}
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Calculating...' : 'Calculate W&B'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <h4 className="font-semibold">Results</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Total Weight</p>
              <p className="font-bold text-lg">{result.totalWeight.toFixed(1)} kg</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Center of Gravity</p>
              <p className="font-bold text-lg">{result.centerOfGravity} mm</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className={`flex-1 p-3 rounded-md ${result.isWithinWeightLimits ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p className="text-sm font-medium">
                Weight: {result.isWithinWeightLimits ? 'OK' : 'EXCEEDED'}
              </p>
            </div>
            <div className={`flex-1 p-3 rounded-md ${result.isWithinCGEnvelope ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p className="text-sm font-medium">
                CG: {result.isWithinCGEnvelope ? 'OK' : 'OUT OF LIMITS'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
