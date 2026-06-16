import { create } from 'zustand';

interface SubmitPayload {
  sessionId: string;
  answers: (string | null)[];
  score: number | null;
  finishedAt: string;
}

interface NetworkState {
  isOnline: boolean;
  pendingSubmissions: SubmitPayload[];
  
  // Actions
  setOnlineStatus: (status: boolean) => void;
  addPendingSubmission: (payload: SubmitPayload) => void;
  clearPendingSubmissions: () => void;
  removePendingSubmission: (sessionId: string) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  // Initialize with the current navigator state if available
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  pendingSubmissions: [],

  setOnlineStatus: (status) => {
    set({ isOnline: status });
  },

  addPendingSubmission: (payload) => {
    set((state) => {
      // Don't add duplicate sessions
      if (state.pendingSubmissions.some(s => s.sessionId === payload.sessionId)) {
        return state;
      }
      return {
        pendingSubmissions: [...state.pendingSubmissions, payload]
      };
    });
  },

  clearPendingSubmissions: () => {
    set({ pendingSubmissions: [] });
  },

  removePendingSubmission: (sessionId) => {
    set((state) => ({
      pendingSubmissions: state.pendingSubmissions.filter(s => s.sessionId !== sessionId)
    }));
  }
}));
