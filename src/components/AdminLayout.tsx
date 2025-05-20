'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };
  
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-[#D9DB84] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/admin" className="text-2xl font-bold text-black">
            ALMA
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              Logged in as: <span className="font-medium">{user.email}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        {children}
      </main>
    </div>
  );
} 