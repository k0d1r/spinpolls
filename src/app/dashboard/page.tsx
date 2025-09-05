'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserPolls, getUserWheels } from '@/lib/database';
import { Poll, Wheel } from '@/types';
import { Button } from '@/components/ui/Button';
import { BarChart3, RotateCcw, Plus, Eye, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [wheels, setWheels] = useState<Wheel[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoadingData(true);
      const [userPolls, userWheels] = await Promise.all([
        getUserPolls(user.uid),
        getUserWheels(user.uid)
      ]);
      setPolls(userPolls);
      setWheels(userWheels);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const copyLink = async (type: 'poll' | 'wheel', id: string) => {
    try {
      const url = `${window.location.origin}/${type}s/${id}`;
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pano</h1>
          <p className="text-gray-600">Anketlerinizi ve çarklarınızı yönetin</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link href="/polls/create">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Anket Oluştur</h3>
                  <p className="text-gray-600 text-lg">Kitlelerinizi sorularla etkileyin</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/wheels/create">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <RotateCcw className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Çark Oluştur</h3>
                  <p className="text-gray-600 text-lg">Dönen çarklarla kararlar verin</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-600 mb-2">Toplam Anket</p>
                <p className="text-4xl font-bold text-gray-900">{polls.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-600 mb-2">Toplam Çark</p>
                <p className="text-4xl font-bold text-gray-900">{wheels.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <RotateCcw className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-600 mb-2">Toplam Oy</p>
                <p className="text-4xl font-bold text-gray-900">
                  {polls.reduce((sum, poll) => sum + poll.totalVotes, 0)}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Polls */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Son Anketler</h2>
            <Link href="/polls">
              <Button variant="outline">Tümünü Gör</Button>
            </Link>
          </div>

          {polls.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {polls.slice(0, 6).map((poll) => (
                <div key={poll.id} className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{poll.title}</h3>
                  {poll.description && (
                    <p className="text-sm text-gray-600 mb-4">{poll.description}</p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    {poll.options.slice(0, 3).map((option) => {
                      const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                      return (
                        <div key={option.id} className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: option.color }}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between text-xs">
                              <span className="truncate">{option.text}</span>
                              <span>{percentage.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div
                                className="h-1 rounded-full"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: option.color
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{poll.totalVotes} oy</span>
                    <span>{new Date(poll.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/polls/${poll.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-1" />
                        Görüntüle
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyLink('poll', poll.id)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Henüz anket yok</h3>
              <p className="text-gray-600 mb-8 text-lg">Başlamak için ilk anketinizi oluşturun</p>
              <Link href="/polls/create">
                <Button className="bg-gradient-to-r from-yellow-400 to-pink-400 text-black hover:from-yellow-300 hover:to-pink-300 font-bold text-lg px-8 py-4 rounded-full shadow-xl">
                  <Plus className="w-5 h-5 mr-2" />
                  Anket Oluştur
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Wheels */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Son Çarklar</h2>
            <Link href="/wheels">
              <Button variant="outline">Tümünü Gör</Button>
            </Link>
          </div>

          {wheels.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wheels.slice(0, 6).map((wheel) => (
                <div key={wheel.id} className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{wheel.title}</h3>
                  {wheel.description && (
                    <p className="text-sm text-gray-600 mb-4">{wheel.description}</p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    {wheel.segments.slice(0, 3).map((segment) => {
                      const percentage = wheel.totalSpins > 0 ? (segment.spins / wheel.totalSpins) * 100 : 0;
                      return (
                        <div key={segment.id} className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: segment.color }}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between text-xs">
                              <span className="truncate">{segment.text}</span>
                              <span>{percentage.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div
                                className="h-1 rounded-full"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: segment.color
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{wheel.totalSpins} döndürme</span>
                    <span>{new Date(wheel.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/wheels/${wheel.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-1" />
                        Görüntüle
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyLink('wheel', wheel.id)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <RotateCcw className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Henüz çark yok</h3>
              <p className="text-gray-600 mb-8 text-lg">Başlamak için ilk çarkınızı oluşturun</p>
              <Link href="/wheels/create">
                <Button className="bg-gradient-to-r from-yellow-400 to-pink-400 text-black hover:from-yellow-300 hover:to-pink-300 font-bold text-lg px-8 py-4 rounded-full shadow-xl">
                  <Plus className="w-5 h-5 mr-2" />
                  Çark Oluştur
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
