'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface CalculationResult {
  distance: number;
  trueCourse: number;
  magneticCourse: number;
  trueHeading: number;
  magneticHeading: number;
  groundSpeed: number;
  windCorrectionAngle: number;
  ete: number;
}

export default function CalculatorPage() {
  const [formData, setFormData] = useState({
    startLat: '',
    startLon: '',
    endLat: '',
    endLon: '',
    tas: '',
    windDirection: '',
    windSpeed: '',
    magneticVariation: '',
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/calculations/navigation', {
        startLat: parseFloat(formData.startLat),
        startLon: parseFloat(formData.startLon),
        endLat: parseFloat(formData.endLat),
        endLon: parseFloat(formData.endLon),
        tas: parseFloat(formData.tas),
        windDirection: formData.windDirection ? parseFloat(formData.windDirection) : undefined,
        windSpeed: formData.windSpeed ? parseFloat(formData.windSpeed) : undefined,
        magneticVariation: formData.magneticVariation ? parseFloat(formData.magneticVariation) : undefined,
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Calculation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Navigation Calculator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Input Parameters</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Latitude</label>
                <input
                  type="number"
                  name="startLat"
                  value={formData.startLat}
                  onChange={handleChange}
                  step="0.0001"
                  required
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="52.1657"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Longitude</label>
                <input
                  type="number"
                  name="startLon"
                  value={formData.startLon}
                  onChange={handleChange}
                  step="0.0001"
                  required
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="20.9671"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">End Latitude</label>
                <input
                  type="number"
                  name="endLat"
                  value={formData.endLat}
                  onChange={handleChange}
                  step="0.0001"
                  required
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="50.0777"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Longitude</label>
                <input
                  type="number"
                  name="endLon"
                  value={formData.endLon}
                  onChange={handleChange}
                  step="0.0001"
                  required
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="19.7848"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">True Airspeed (kt)</label>
              <input
                type="number"
                name="tas"
                value={formData.tas}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="110"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Wind Direction (°)</label>
                <input
                  type="number"
                  name="windDirection"
                  value={formData.windDirection}
                  onChange={handleChange}
                  min="0"
                  max="360"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="270"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Wind Speed (kt)</label>
                <input
                  type="number"
                  name="windSpeed"
                  value={formData.windSpeed}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="15"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Magnetic Variation (+ East)</label>
              <input
                type="number"
                name="magneticVariation"
                value={formData.magneticVariation}
                onChange={handleChange}
                step="0.1"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="5.5"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Calculating...' : 'Calculate'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Results</h2>
          
          {result ? (
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Distance</span>
                <span className="font-semibold">{result.distance} NM</span>
              </div>
              <div className="flex justify-between py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">True Course</span>
                <span className="font-semibold">{result.trueCourse}°</span>
              </div>
              <div className="flex justify-between py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Magnetic Course</span>
                <span className="font-semibold">{result.magneticCourse}°</span>
              </div>
              <div className="flex justify-between py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">True Heading</span>
                <span className="font-semibold">{result.trueHeading}°</span>
              </div>
              <div className="flex justify-between py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Magnetic Heading</span>
                <span className="font-semibold">{result.magneticHeading}°</span>
              </div>
              <div className="flex justify-between py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Ground Speed</span>
                <span className="font-semibold">{result.groundSpeed} kt</span>
              </div>
              <div className="flex justify-between py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Wind Correction Angle</span>
                <span className="font-semibold">{result.windCorrectionAngle}°</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">ETE</span>
                <span className="font-semibold">{result.ete} min</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Enter parameters and click Calculate to see results
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
