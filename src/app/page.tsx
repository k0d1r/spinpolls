'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { BarChart3, RotateCcw, Share2, TrendingUp, Users, Zap } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Etkileşimli
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                {' '}Anketler & Çarklar
              </span>
              <br />
              Oluşturun
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Kitlelerinizi etkileşimli anketler ve dönen çarklarla etkileyin. 
              Anında paylaşın, yanıtları toplayın ve sonuçları gerçek zamanlı görselleştirin.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-pink-400 text-black hover:from-yellow-300 hover:to-pink-300 font-bold text-lg px-8 py-4 rounded-full shadow-2xl border-0">
                      📊 Panoya Git
                    </Button>
                  </Link>
                  <Link href="/polls/create">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-black font-bold text-lg px-8 py-4 rounded-full">
                      🗳️ Anket Oluştur
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-pink-400 text-black hover:from-yellow-300 hover:to-pink-300 font-bold text-lg px-8 py-4 rounded-full shadow-2xl border-0">
                      🚀 Ücretsiz Başla
                    </Button>
                  </Link>
                  <Link href="/polls">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-black font-bold text-lg px-8 py-4 rounded-full">
                      🔍 Anketleri Keşfet
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Kitlelerinizi Etkilemek İçin Her Şey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Basit anketlerden etkileşimli dönen çarklara kadar, kitlenizin seveceği etkileyici deneyimler oluşturun.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Polls Feature */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Etkileşimli Anketler</h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Çoktan seçmeli sorularla etkileyici anketler oluşturun. Anında geri bildirim alın ve sonuçları güzel grafiklerle görselleştirin.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="font-medium">Gerçek zamanlı sonuçlar</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="font-medium">Özelleştirilebilir seçenekler</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="font-medium">Paylaşılabilir bağlantılar</span>
                </li>
              </ul>
            </div>

            {/* Wheels Feature */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <RotateCcw className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Dönen Çarklar</h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Ağırlıklı bölümlerle özel dönen çarklar oluşturun. Çekilişler, karar verme ve eğlenceli aktiviteler için mükemmel.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                  <span className="font-medium">Özel olasılıklar</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                  <span className="font-medium">Akıcı animasyonlar</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                  <span className="font-medium">Sonuç takibi</span>
                </li>
              </ul>
            </div>

            {/* Analytics Feature */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Gerçek Zamanlı Analitik</h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Etkileşimi ve sonuçları gerçek zamanlı takip edin. Detaylı analitikleri görüntüleyin ve daha fazla analiz için verileri dışa aktarın.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span className="font-medium">Canlı güncellemeler</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span className="font-medium">Detaylı içgörüler</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span className="font-medium">Veri dışa aktarma</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-br from-slate-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Nasıl Çalışır?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Basit üç adımlı sürecimizle dakikalar içinde başlayın.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-pink-400 text-black rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Oluştur</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Kaydolun ve anketinizi veya çarkınızı oluşturun. İhtiyaçlarınıza uygun renkleri, seçenekleri ve ayarları özelleştirin.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-pink-400 text-black rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Paylaş</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Paylaşılabilir bir bağlantı alın ve kitlenize gönderin. Katılımcılar için kayıt gerekmez.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-pink-400 text-black rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Analiz Et</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Sonuçların gerçek zamanlı olarak gelmesini izleyin. Kitle etkileşiminiz hakkında detaylı analitikleri ve içgörüleri görüntüleyin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Kitlelerinizi Etkilemeye Hazır mısınız?
          </h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            Harika etkileşimli deneyimler oluşturmak için Ark'ı kullanan binlerce yaratıcıya katılın.
          </p>
          <div className="space-y-4">
            {user ? (
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="bg-white text-black hover:bg-gray-100 font-bold text-xl px-12 py-4 rounded-full shadow-2xl border-0">
                  📊 Panoya Git
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button variant="outline" size="lg" className="bg-white text-black hover:bg-gray-100 font-bold text-xl px-12 py-4 rounded-full shadow-2xl border-0">
                  🚀 Ücretsiz Başla
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}