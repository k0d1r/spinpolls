'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Plus, BarChart3 } from 'lucide-react';

export default function PollsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Anketler</h1>
          <p className="text-xl text-gray-600 mb-8">
            Etkileşimli anketler oluşturun ve kitlenizden anında geri bildirim alın
          </p>
          <Link href="/polls/create">
            <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-pink-400 text-black hover:from-yellow-300 hover:to-pink-300 font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              Yeni Anket Oluştur
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example poll cards */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sample Poll</h3>
                <p className="text-sm text-gray-500">What's your favorite color?</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Blue</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="text-sm text-gray-500">127 votes</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Another Poll</h3>
                <p className="text-sm text-gray-500">Which platform do you prefer?</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Mobile</span>
                <span>60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div className="text-sm text-gray-500">89 votes</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Third Poll</h3>
                <p className="text-sm text-gray-500">How often do you exercise?</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Daily</span>
                <span>30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div className="text-sm text-gray-500">203 votes</div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Kendi anketinizi oluşturmaya hazır mısınız?</p>
          <Link href="/polls/create">
            <Button className="bg-gradient-to-r from-yellow-400 to-pink-400 text-black hover:from-yellow-300 hover:to-pink-300 font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              İlk Anketinizi Oluşturun
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
