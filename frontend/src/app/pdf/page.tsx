'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function PdfExportPage() {
  const [flightPlanId, setFlightPlanId] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPdfUrl('');
    try {
      const response = await api.get(`/pdf/flight-plan/${flightPlanId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPdfUrl(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Export failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Export Flight Plan to PDF</h1>
      <form onSubmit={handleExport} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Flight Plan ID</label>
          <input
            type="text"
            value={flightPlanId}
            onChange={e => setFlightPlanId(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="Paste flight plan ID"
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Exporting...' : 'Export PDF'}
        </button>
      </form>
      {pdfUrl && (
        <div className="mt-6">
          <a
            href={pdfUrl}
            download={`flight-plan-${flightPlanId}.pdf`}
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}
