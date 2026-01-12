import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PdfDownloadButton } from './PdfDownloadButton';

// Mock the api module
jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

// Mock URL methods
global.URL.createObjectURL = jest.fn(() => 'blob:test');
global.URL.revokeObjectURL = jest.fn();

describe('PdfDownloadButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default label for flight-plan type', () => {
    render(<PdfDownloadButton type="flight-plan" id="123" />);
    expect(screen.getByText('Download Flight Plan')).toBeInTheDocument();
  });

  it('renders with default label for weather-briefing type', () => {
    render(<PdfDownloadButton type="weather-briefing" id="EPWA" />);
    expect(screen.getByText('Download Briefing')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<PdfDownloadButton type="flight-plan" id="123" label="Custom Label" />);
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('shows loading state when clicked', async () => {
    const { api } = require('@/lib/api');
    api.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<PdfDownloadButton type="flight-plan" id="123" />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(screen.getByText('Generating...')).toBeInTheDocument();
  });

  it('calls correct endpoint for flight-plan', async () => {
    const { api } = require('@/lib/api');
    api.get.mockResolvedValue({ data: new Blob(['pdf content']) });

    render(<PdfDownloadButton type="flight-plan" id="123" />);
    
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/pdf/flight-plan/123', { responseType: 'blob' });
    });
  });

  it('calls correct endpoint for weather-briefing', async () => {
    const { api } = require('@/lib/api');
    api.get.mockResolvedValue({ data: new Blob(['pdf content']) });

    render(<PdfDownloadButton type="weather-briefing" id="EPWA" />);
    
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/pdf/weather-briefing/EPWA', { responseType: 'blob' });
    });
  });

  it('handles download error gracefully', async () => {
    const { api } = require('@/lib/api');
    api.get.mockRejectedValue(new Error('Network error'));
    
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<PdfDownloadButton type="flight-plan" id="123" />);
    
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Failed to download PDF. Please try again.');
    });

    alertSpy.mockRestore();
  });

  it('applies custom className', () => {
    render(<PdfDownloadButton type="flight-plan" id="123" className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('is disabled while loading', async () => {
    const { api } = require('@/lib/api');
    api.get.mockImplementation(() => new Promise(() => {}));

    render(<PdfDownloadButton type="flight-plan" id="123" />);
    
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
