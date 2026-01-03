import { create } from 'zustand';
import { api } from '../lib/api';

interface Metar {
  raw: string;
  station: string;
  time: string;
  windDirection?: number;
  windSpeed?: number;
  windGust?: number;
  visibility?: number;
  temperature?: number;
  dewPoint?: number;
  qnh?: number;
  flightCategory?: string;
}

interface Taf {
  raw: string;
  station: string;
  issueTime: string;
  validFrom: string;
  validTo: string;
  forecast: TafPeriod[];
}

interface TafPeriod {
  type: string;
  from: string;
  to: string;
  windDirection?: number;
  windSpeed?: number;
  visibility?: number;
  weather?: string[];
}

interface WeatherData {
  metar?: Metar;
  taf?: Taf;
  fromCache: boolean;
  cachedAt?: string;
}

interface WeatherStore {
  weatherData: Record<string, WeatherData>;
  isLoading: boolean;
  error: string | null;

  fetchWeather: (icaoCode: string) => Promise<WeatherData>;
  fetchMultipleWeather: (icaoCodes: string[]) => Promise<void>;
  clearWeather: () => void;
  clearError: () => void;
}

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  weatherData: {},
  isLoading: false,
  error: null,

  fetchWeather: async (icaoCode: string) => {
    const upperIcao = icaoCode.toUpperCase();
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/weather/${upperIcao}`);
      const data = response.data;
      set((state) => ({
        weatherData: { ...state.weatherData, [upperIcao]: data },
        isLoading: false,
      }));
      return data;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch weather', isLoading: false });
      throw error;
    }
  },

  fetchMultipleWeather: async (icaoCodes: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const promises = icaoCodes.map((code) =>
        api.get(`/weather/${code.toUpperCase()}`).then((res) => ({
          code: code.toUpperCase(),
          data: res.data,
        }))
      );
      const results = await Promise.allSettled(promises);
      
      const newWeatherData: Record<string, WeatherData> = {};
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          newWeatherData[result.value.code] = result.value.data;
        }
      });

      set((state) => ({
        weatherData: { ...state.weatherData, ...newWeatherData },
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: 'Failed to fetch weather data', isLoading: false });
    }
  },

  clearWeather: () => set({ weatherData: {} }),
  clearError: () => set({ error: null }),
}));
