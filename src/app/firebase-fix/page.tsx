'use client';

import { useState } from 'react';

export default function FirebaseFixPage() {
  const [copied, setCopied] = useState(false);

  const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  const copyRules = () => {
    navigator.clipboard.writeText(rules);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">
            🚨 ACİL ÇÖZÜM - Firebase Security Rules
          </h1>

          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              ⚡ HEMEN YAPIN!
            </h2>
            <p className="text-red-700 mb-6 text-lg">
              "Missing or insufficient permissions" hatası alıyorsanız, aşağıdaki adımları takip edin:
            </p>
            
            <ol className="list-decimal list-inside space-y-4 text-red-700 text-lg">
              <li>
                <strong>Firebase Console'a gidin:</strong>{' '}
                <a 
                  href="https://console.firebase.google.com" 
                  target="_blank" 
                  className="text-blue-600 underline font-semibold"
                >
                  console.firebase.google.com
                </a>
              </li>
              <li>
                <strong>Projenizi seçin:</strong>{' '}
                <span className="bg-red-100 px-3 py-1 rounded font-mono">kadircloudcom</span>
              </li>
              <li>
                <strong>Firestore Database → Rules</strong> sekmesine gidin
              </li>
              <li>
                <strong>Mevcut rules'ları tamamen silin</strong> ve aşağıdakini yapıştırın:
              </li>
            </ol>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Security Rules</h3>
              <button
                onClick={copyRules}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                {copied ? '✅ Kopyalandı!' : '📋 Kopyala'}
              </button>
            </div>
            <pre className="text-green-400 text-sm overflow-x-auto">
              <code>{rules}</code>
            </pre>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-4">
              📋 Son Adım
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-yellow-700 text-lg">
              <li>Rules'ları yapıştırdıktan sonra <strong>"Publish"</strong> butonuna tıklayın</li>
              <li>Onay verin</li>
              <li>Sayfayı yenileyin (Ctrl+F5)</li>
            </ol>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              ✅ Test Edin
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a 
                href="/polls/create" 
                className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:from-blue-400 hover:to-purple-400 transition-colors"
              >
                🗳️ Anket Oluştur
              </a>
              <a 
                href="/wheels/create" 
                className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-400 hover:to-pink-400 transition-colors"
              >
                🎡 Çark Oluştur
              </a>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-blue-800 mb-4">
              🆘 Hala Çalışmıyor mu?
            </h3>
            <ul className="list-disc list-inside space-y-2 text-blue-700">
              <li>Tarayıcı konsolunu açın (F12) ve hata mesajlarını kontrol edin</li>
              <li>Firebase Console'da Rules'ların güncellendiğini kontrol edin</li>
              <li>Sayfayı yenileyin (Ctrl+F5)</li>
              <li>Farklı bir tarayıcı deneyin</li>
            </ul>
          </div>

          <div className="mt-8 text-center">
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
