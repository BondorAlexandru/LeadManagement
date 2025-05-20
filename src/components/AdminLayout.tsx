'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // The useEffect will redirect to login
  }
  
  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r bg-[#f9f9e1]">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-black">alma</h1>
        </div>
        
        <nav className="mt-6">
          <div className="px-6 py-3">
            <Link href="/admin" className="text-lg font-medium text-black hover:text-gray-700">
              Leads
            </Link>
          </div>
          <div className="px-6 py-3">
            <Link href="/admin/settings" className="text-lg font-medium text-black hover:text-gray-700">
              Settings
            </Link>
          </div>
        </nav>
        
        <div className="absolute bottom-8 px-6">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold mr-3">
              A
            </div>
            <div className="text-black font-medium">
              Admin
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
} 