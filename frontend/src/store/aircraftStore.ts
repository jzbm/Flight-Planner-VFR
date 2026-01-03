import { create } from 'zustand';
import { api } from '../lib/api';

interface Aircraft {
  id: string;
  registration: string;
  type: string;
  model: string;
  cruiseSpeed: number;
  fuelConsumption: number;
  maxTakeoffWeight: number;
  emptyWeight: number;
  emptyWeightArm: number;
  fuelCapacity: number;
  cgEnvelope?: { weight: number; arm: number }[];
  createdAt: string;
}

interface WeightBalanceInput {
  pilotWeight: number;
  coPilotWeight?: number;
  rearPassengersWeight?: number;
  baggageWeight?: number;
  fuelWeight: number;
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

interface AircraftStore {
  aircraft: Aircraft[];
  selectedAircraft: Aircraft | null;
  weightBalanceResult: WeightBalanceResult | null;
  isLoading: boolean;
  error: string | null;

  fetchAircraft: () => Promise<void>;
  createAircraft: (data: Partial<Aircraft>) => Promise<Aircraft>;
  updateAircraft: (id: string, data: Partial<Aircraft>) => Promise<void>;
  deleteAircraft: (id: string) => Promise<void>;
  selectAircraft: (aircraft: Aircraft | null) => void;
  calculateWeightBalance: (aircraftId: string, input: WeightBalanceInput) => Promise<WeightBalanceResult>;
  clearError: () => void;
}

export const useAircraftStore = create<AircraftStore>((set) => ({
  aircraft: [],
  selectedAircraft: null,
  weightBalanceResult: null,
  isLoading: false,
  error: null,

  fetchAircraft: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/aircraft');
      set({ aircraft: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch aircraft', isLoading: false });
    }
  },

  createAircraft: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/aircraft', data);
      const newAircraft = response.data;
      set((state) => ({
        aircraft: [newAircraft, ...state.aircraft],
        isLoading: false,
      }));
      return newAircraft;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create aircraft', isLoading: false });
      throw error;
    }
  },

  updateAircraft: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/aircraft/${id}`, data);
      set((state) => ({
        aircraft: state.aircraft.map((a) => (a.id === id ? response.data : a)),
        selectedAircraft: state.selectedAircraft?.id === id ? response.data : state.selectedAircraft,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update aircraft', isLoading: false });
      throw error;
    }
  },

  deleteAircraft: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/aircraft/${id}`);
      set((state) => ({
        aircraft: state.aircraft.filter((a) => a.id !== id),
        selectedAircraft: state.selectedAircraft?.id === id ? null : state.selectedAircraft,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete aircraft', isLoading: false });
      throw error;
    }
  },

  selectAircraft: (aircraft) => set({ selectedAircraft: aircraft }),

  calculateWeightBalance: async (aircraftId, input) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/aircraft/${aircraftId}/weight-balance`, input);
      set({ weightBalanceResult: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to calculate weight balance', isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
