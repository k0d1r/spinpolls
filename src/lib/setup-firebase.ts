import { adminAuth, adminDb } from './firebase-admin';

// Firebase projesini otomatik yapılandır
export const setupFirebaseProject = async () => {
  try {
    console.log('🚀 Firebase projesi yapılandırılıyor...');

    // 1. Firestore koleksiyonlarını oluştur
    await createFirestoreCollections();
    
    // 2. Security Rules'ları ayarla
    await setupSecurityRules();
    
    // 3. Authentication provider'larını kontrol et
    await checkAuthProviders();
    
    console.log('✅ Firebase projesi başarıyla yapılandırıldı!');
    return { success: true };
  } catch (error) {
    console.error('❌ Firebase yapılandırma hatası:', error);
    return { success: false, error };
  }
};

// Firestore koleksiyonlarını oluştur
const createFirestoreCollections = async () => {
  try {
    console.log('📊 Firestore koleksiyonları oluşturuluyor...');
    
    // Users koleksiyonu için örnek doküman
    const usersRef = adminDb.collection('users');
    await usersRef.doc('_setup').set({
      message: 'Firebase setup completed',
      timestamp: new Date()
    });
    
    // Polls koleksiyonu için örnek doküman
    const pollsRef = adminDb.collection('polls');
    await pollsRef.doc('_setup').set({
      message: 'Polls collection ready',
      timestamp: new Date()
    });
    
    // Wheels koleksiyonu için örnek doküman
    const wheelsRef = adminDb.collection('wheels');
    await wheelsRef.doc('_setup').set({
      message: 'Wheels collection ready',
      timestamp: new Date()
    });
    
    // Poll votes koleksiyonu için örnek doküman
    const pollVotesRef = adminDb.collection('pollVotes');
    await pollVotesRef.doc('_setup').set({
      message: 'Poll votes collection ready',
      timestamp: new Date()
    });
    
    // Wheel spins koleksiyonu için örnek doküman
    const wheelSpinsRef = adminDb.collection('wheelSpins');
    await wheelSpinsRef.doc('_setup').set({
      message: 'Wheel spins collection ready',
      timestamp: new Date()
    });
    
    console.log('✅ Firestore koleksiyonları oluşturuldu');
  } catch (error) {
    console.error('❌ Firestore koleksiyonları oluşturma hatası:', error);
    throw error;
  }
};

// Security Rules'ları ayarla (bu kısım Firebase Console'da manuel yapılmalı)
const setupSecurityRules = async () => {
  console.log('🔒 Security Rules ayarlanıyor...');
  console.log('⚠️  Security Rules Firebase Console\'da manuel olarak ayarlanmalı');
  console.log('📋 Rules dosyası: firestore.rules');
};

// Authentication provider'larını kontrol et
const checkAuthProviders = async () => {
  console.log('🔐 Authentication provider\'ları kontrol ediliyor...');
  console.log('⚠️  Authentication provider\'ları Firebase Console\'da manuel olarak etkinleştirilmeli');
  console.log('📋 Gerekli provider\'lar: Google, Email/Password');
};

// Proje durumunu kontrol et
export const checkFirebaseStatus = async () => {
  try {
    console.log('🔍 Firebase proje durumu kontrol ediliyor...');
    
    // Firestore bağlantısını test et
    const testDoc = await adminDb.collection('_test').doc('connection').get();
    if (!testDoc.exists) {
      await adminDb.collection('_test').doc('connection').set({
        status: 'connected',
        timestamp: new Date()
      });
    }
    
    console.log('✅ Firebase projesi çalışıyor');
    return { 
      status: 'connected',
      firestore: true,
      auth: adminAuth ? true : false,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('❌ Firebase proje durumu kontrol hatası:', error);
    return { 
      status: 'error',
      error: error.message,
      timestamp: new Date()
    };
  }
};
