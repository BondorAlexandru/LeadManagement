import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/types';
import { login as apiLogin, logout as apiLogout } from '@/lib/auth';

interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'authenticated' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

// Check for existing user in localStorage during initialization
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      initialState.user = JSON.parse(storedUser);
      initialState.status = 'authenticated';
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
    }
  }
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await apiLogin(email, password);
      if (!user) {
        return rejectWithValue('Invalid email or password');
      }
      return user;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await apiLogout();
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload;
        state.error = null;
        
        // Store user in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Authentication failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
        
        // Remove user from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer; 