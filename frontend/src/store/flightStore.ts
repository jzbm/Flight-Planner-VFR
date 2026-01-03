import { create } from 'zustand';
import { api } from '../lib/api';

interface Waypoint {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  type: string;
}

interface FlightPlan {
  id: string;
  name: string;
  departureAirportId?: string;
  arrivalAirportId?: string;
  aircraftId?: string;
  waypoints: Waypoint[];
  totalDistance?: number;
  estimatedTime?: number;
  fuelRequired?: number;
  createdAt: string;
}

interface FlightStore {
  flightPlans: FlightPlan[];
  currentPlan: FlightPlan | null;
  isLoading: boolean;
  error: string | null;
  
  fetchFlightPlans: () => Promise<void>;
  fetchFlightPlan: (id: string) => Promise<void>;
  createFlightPlan: (data: Partial<FlightPlan>) => Promise<FlightPlan>;
  updateFlightPlan: (id: string, data: Partial<FlightPlan>) => Promise<void>;
  deleteFlightPlan: (id: string) => Promise<void>;
  setCurrentPlan: (plan: FlightPlan | null) => void;
  addWaypoint: (waypoint: Waypoint) => void;
  removeWaypoint: (index: number) => void;
  updateWaypoint: (index: number, waypoint: Waypoint) => void;
  reorderWaypoints: (startIndex: number, endIndex: number) => void;
  clearError: () => void;
}

export const useFlightStore = create<FlightStore>((set, get) => ({
  flightPlans: [],
  currentPlan: null,
  isLoading: false,
  error: null,

  fetchFlightPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/flight-plans');
      set({ flightPlans: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch flight plans', isLoading: false });
    }
  },

  fetchFlightPlan: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/flight-plans/${id}`);
      set({ currentPlan: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch flight plan', isLoading: false });
    }
  },

  createFlightPlan: async (data: Partial<FlightPlan>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/flight-plans', data);
      const newPlan = response.data;
      set((state) => ({
        flightPlans: [newPlan, ...state.flightPlans],
        currentPlan: newPlan,
        isLoading: false,
      }));
      return newPlan;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create flight plan', isLoading: false });
      throw error;
    }
  },

  updateFlightPlan: async (id: string, data: Partial<FlightPlan>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/flight-plans/${id}`, data);
      set((state) => ({
        flightPlans: state.flightPlans.map((p) => (p.id === id ? response.data : p)),
        currentPlan: state.currentPlan?.id === id ? response.data : state.currentPlan,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update flight plan', isLoading: false });
      throw error;
    }
  },

  deleteFlightPlan: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/flight-plans/${id}`);
      set((state) => ({
        flightPlans: state.flightPlans.filter((p) => p.id !== id),
        currentPlan: state.currentPlan?.id === id ? null : state.currentPlan,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete flight plan', isLoading: false });
      throw error;
    }
  },

  setCurrentPlan: (plan) => set({ currentPlan: plan }),

  addWaypoint: (waypoint) => {
    const { currentPlan } = get();
    if (currentPlan) {
      set({
        currentPlan: {
          ...currentPlan,
          waypoints: [...currentPlan.waypoints, waypoint],
        },
      });
    }
  },

  removeWaypoint: (index) => {
    const { currentPlan } = get();
    if (currentPlan) {
      set({
        currentPlan: {
          ...currentPlan,
          waypoints: currentPlan.waypoints.filter((_, i) => i !== index),
        },
      });
    }
  },

  updateWaypoint: (index, waypoint) => {
    const { currentPlan } = get();
    if (currentPlan) {
      const newWaypoints = [...currentPlan.waypoints];
      newWaypoints[index] = waypoint;
      set({
        currentPlan: {
          ...currentPlan,
          waypoints: newWaypoints,
        },
      });
    }
  },

  reorderWaypoints: (startIndex, endIndex) => {
    const { currentPlan } = get();
    if (currentPlan) {
      const newWaypoints = [...currentPlan.waypoints];
      const [removed] = newWaypoints.splice(startIndex, 1);
      newWaypoints.splice(endIndex, 0, removed);
      set({
        currentPlan: {
          ...currentPlan,
          waypoints: newWaypoints,
        },
      });
    }
  },

  clearError: () => set({ error: null }),
}));
