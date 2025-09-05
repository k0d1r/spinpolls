'use client';

import { useEffect, useState } from 'react';

export default function FirebaseTestPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [settingUp, setSettingUp] = useState(false);
  const [updatingRules, setUpdatingRules] = useState(false);

  useEffect(() => {
    checkFirebaseStatus();
  }, []);

  const checkFirebaseStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/firebase-setup');
      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({ 
        status: 'error', 
        error: error.message,
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
    }
  };

  const setupFirebase = async () => {
    try {
      setSettingUp(true);
      const response = await fetch('/api/firebase-setup', {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success) {
        // Setup tamamlandıktan sonra durumu tekrar kontrol et
        await checkFirebaseStatus();
      } else {
        setTestResult(result);
      }
    } catch (error) {
      setTestResult({ 
        success: false, 
        error: error.message,
        timestamp: new Date()
      });
    } finally {
      setSettingUp(false);
    }
  };

  const updateRules = async () => {
    try {
      setUpdatingRules(true);
      const response = await fetch('/api/update-rules', {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success) {
        alert('Security Rules test edildi! Firebase Console\'da manuel olarak güncelleyin.');
        console.log('Rules:', result.rules);
      } else {
        alert('Rules güncelleme hatası: ' + result.error);
      }
    } catch (error) {
      alert('Rules güncelleme hatası: ' + error.message);
    } finally {
      setUpdatingRules(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Firebase yapılandırması test ediliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            🔥 Firebase Yapılandırma Testi
          </h1>

          {testResult?.status === 'connected' ? (
            <div className="space-y-6">
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                  ✅ Firebase Başarıyla Yapılandırıldı!
                </h2>
                <p className="text-green-700 text-lg mb-4">
                  Firebase projeniz doğru şekilde yapılandırılmış ve çalışıyor.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-green-100 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800">Firestore</h3>
                    <p className="text-green-600">✅ Bağlantı başarılı</p>
                  </div>
                  <div className="bg-green-100 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800">Authentication</h3>
                    <p className="text-green-600">✅ Yapılandırıldı</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  🎉 Tebrikler! Uygulamanız hazır
                </h3>
                <p className="text-blue-700 mb-4">
                  Firebase projeniz tamamen yapılandırıldı. Artık anketler ve çarklar oluşturabilirsiniz!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="/" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-pink-400 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-pink-300 transition-colors"
                  >
                    🏠 Ana Sayfaya Git
                  </a>
                  <a 
                    href="/polls/create" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:from-blue-400 hover:to-purple-400 transition-colors"
                  >
                    🗳️ Anket Oluştur
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
                  ❌ Firebase Yapılandırma Hatası
                </h2>
                <p className="text-red-700 mb-4 text-lg">
                  Firebase projenizde bir yapılandırma sorunu var.
                </p>
                <div className="bg-red-100 rounded-lg p-4">
                  <pre className="text-sm text-red-800 overflow-auto">
                    {JSON.stringify(testResult?.error, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-yellow-800 mb-4">
                  🛠️ Otomatik Yapılandırma
                </h3>
                <p className="text-yellow-700 mb-6">
                  Firebase projenizi otomatik olarak yapılandırmak için aşağıdaki butona tıklayın.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={setupFirebase}
                    disabled={settingUp}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-pink-400 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-pink-300 transition-colors disabled:opacity-50"
                  >
                    {settingUp ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                        Yapılandırılıyor...
                      </>
                    ) : (
                      <>
                        🚀 Firebase'i Yapılandır
                      </>
                    )}
                  </button>
                  <button
                    onClick={updateRules}
                    disabled={updatingRules}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:from-blue-400 hover:to-purple-400 transition-colors disabled:opacity-50"
                  >
                    {updatingRules ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Rules Güncelleniyor...
                      </>
                    ) : (
                      <>
                        🔒 Security Rules Güncelle
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-red-800 mb-4">
                  🚨 HIZLI ÇÖZÜM - Security Rules
                </h3>
                <p className="text-red-700 mb-4 font-semibold">
                  "Missing or insufficient permissions" hatası alıyorsanız:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-red-700 mb-4">
                  <li>Firebase Console'a gidin: <a href="https://console.firebase.google.com" target="_blank" className="text-blue-600 underline font-semibold">console.firebase.google.com</a></li>
                  <li>Projenizi seçin: <strong className="bg-red-100 px-2 py-1 rounded">kadircloudcom</strong></li>
                  <li>Firestore Database → Rules sekmesine gidin</li>
                  <li>Mevcut rules'ları silin ve aşağıdakini yapıştırın:</li>
                </ol>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 overflow-x-auto">
                  <pre className="text-sm">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                  </pre>
                </div>
                <p className="text-red-700 font-semibold">
                  5. <strong>Publish</strong> butonuna tıklayın ve onaylayın
                </p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  📋 Authentication Yapılandırması
                </h3>
                <ol className="list-decimal list-inside space-y-3 text-blue-700">
                  <li>Firebase Console'da <strong>Authentication</strong> bölümüne gidin</li>
                  <li><strong>"Get started"</strong> butonuna tıklayın</li>
                  <li><strong>"Sign-in method"</strong> sekmesine gidin</li>
                  <li><strong>Google</strong> provider'ını etkinleştirin</li>
                  <li><strong>Email/Password</strong> provider'ını etkinleştirin</li>
                </ol>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={checkFirebaseStatus}
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors mr-4"
            >
              🔄 Tekrar Test Et
            </button>
            <a 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold rounded-lg hover:from-gray-300 hover:to-gray-500 transition-colors"
            >
              🏠 Ana Sayfaya Dön
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
