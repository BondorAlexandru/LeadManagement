import { User } from '@/types';
import { mockUser } from './mockData';

// Mock authentication functions
export async function login(email: string, password: string): Promise<User | null> {
  // In a real app, this would verify credentials against a database
  if (email === 'admin@tryalma.ai' && password === 'password') {
    return mockUser;
  }
  return null;
}

export async function logout(): Promise<void> {
  // In a real app, this would clear server-side sessions
  return Promise.resolve();
} 