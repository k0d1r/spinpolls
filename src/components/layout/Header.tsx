'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { logout } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Menu, X, User, LogOut, BarChart3, RotateCcw } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, userData } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">Ark</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/polls" className="text-gray-700 hover:text-yellow-500 font-semibold transition-colors">
              Anketler
            </Link>
            <Link href="/wheels" className="text-gray-700 hover:text-pink-500 font-semibold transition-colors">
              Çarklar
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-700 hover:text-purple-500 font-semibold transition-colors">
                  Pano
                </Link>
                <div className="flex items-center space-x-3">
                  {userData?.photoURL ? (
                    <img
                      src={userData.photoURL}
                      alt={userData.displayName}
                      className="w-8 h-8 rounded-full border-2 border-yellow-400"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-black" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {userData?.displayName || user.email}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:text-red-600 font-semibold"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Çıkış
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth">
                  <Button variant="ghost" className="font-semibold">Giriş Yap</Button>
                </Link>
                <Link href="/auth">
                  <Button variant="outline" className="bg-gradient-to-r from-yellow-400 to-pink-400 text-black hover:from-yellow-300 hover:to-pink-300 font-semibold border-0">Başla</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              size="sm"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                href="/polls"
                className="text-gray-700 hover:text-yellow-500 font-semibold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Anketler
              </Link>
              <Link
                href="/wheels"
                className="text-gray-700 hover:text-pink-500 font-semibold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Çarklar
              </Link>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-purple-500 font-semibold transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pano
                  </Link>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      {userData?.photoURL ? (
                        <img
                          src={userData.photoURL}
                          alt={userData.displayName}
                          className="w-10 h-10 rounded-full border-2 border-yellow-400"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-black" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {userData?.displayName || user.email}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:text-red-600 font-semibold"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Çıkış
                    </Button>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link href="/auth" className="block">
                    <Button variant="ghost" className="w-full justify-start font-semibold">
                      Giriş Yap
                    </Button>
                  </Link>
                  <Link href="/auth" className="block">
                    <Button className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 text-black hover:from-yellow-300 hover:to-pink-300 font-semibold">Başla</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
