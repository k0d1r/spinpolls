const admin = require('firebase-admin');

// Service account ile bağlantı kur
const serviceAccount = {
  type: "service_account",
  project_id: "kadircloudcom",
  private_key_id: "015616820366bedc3800196ca6c5016d96f82323",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmuEPDR/OtuDnJ\nG6Gr9vpmnaU5STIzBCUBQTwlLD3kTJkkiDDf5WE+1KSQvWWeyqU+jCj98nscjKvR\nF3k8Ij6eTlyXiKYenrHlQojqKeaU4KucZwLkFDNvljq1UMTJMLs3R41YP0tGYQut\nNIdJoA+ujZwlzSEmdAogN9aHBLe9Pgec3M46DJM9adU8P3gXx2cCI4FejAKdvPZm\nz2iscG6VbeomqKaZGCl7Wm7ZF1zMas98VrVLtldXpKV9whrr8gkHPjRVyearodBB\nPLQn/6jL0HzXhLSYnI812ZNlYrnIy0OkCq493SUqubnqlej0mgal/YkJCOtLmcKx\nQL9pS8IhAgMBAAECggEAAYkeKtU9xDR3l/UYrTp16jDYE9CQl/NTwoNtn19ygujg\n9VBUaBU0ev6nH6QWn0Kz82ZueKTVhRY8sqfGrJ2ZjK3GzkNCeZ2Z9eqciNt0ZxEw\n9CHyLw7qffPmTr4GRaliDxIPgL/6qd9k1ckEzjz9VKeeTU4/81BeLmzp6CCshH+N\nsAUZWzq0BFgDO4j4Jj35Exn6qufSfRhxT0UnVZpsoMEXw6ZCDyk40ZM/ClP9Ddh8\nmosy9OuTFW5dngAeRfgmkRJTgfG1FJv3vOSLJdSuhe/PSZw1yV7n8boXVvTb9FL6\nm3+MXqfWFMaIceBD9xnSVzBgCBpFpz+EEHjQPZJmEQKBgQDXJGWGafrW96w0HPWn\nMGGG2tmRd3XCeEvCMvUGNe3c7J+HdLvRl6aXg7bFL/7TCdS51ssCynU1YjsEgkBI\npL5+URQXNc66laFLnTiEnpiNp75BbKU3ONx7eUVtFY3MuRiGIIRPCpjiQnB0yhxB\nh+q+cw/3jiwgedwLdNO7CKTrsQKBgQDGYbVmeRjHVzaKxoPUS5lfzKb0ct04U6Bf\nAdpAf1v1UwLXUq5XLHU1x00HXJaj0tfpHzpuTvOBQLN/RWSsPaN39RcO2PF8uR1g\ne/9Kne213aDaHS+iKjTwdEzx7OYvAlCMYc45BDGUnLJi3E1MRD99EHVwjT5QDe8q\nmjpfOb6JcQKBgQCQOl8xeBToTguMuClbFs0a2dZndb1lTL4FB6JJspeutpbP+Ur8\nXH0bL/q0QNPFaN7KYxuf2FgxHJRSFnu/92mZRwN/99uKLEuAZHsCNUwyEtUyCQLN\nfXoZ8JfBZGS2bRPqvxvT3VfWvxGiyeedat/NI1f97rrYXrlMmNpklYvyUQKBgBOD\n4yNsgDqD4tKuCqPkt/bLnBTqA8cZuun9tamonbQ5cUsbUBk1P2aF75bszcjZ4fGF\n5+qYC65IXiAEBI5JFf6j9pu4TbE2SKSILin59TtxzPQH8Pqj6kdJOZSG+HHhaWkV\n6gKD3hi/fXDqORRqllBIQTVMP7gCVue6+kkJ1iuRAoGAfukmzKf1jpF4OBaHZG4J\nrAkeT/6gZ65Oi5a+bD+JxnETOjugaoUDXB/HuU2mbzzLDb1iKA05VcZsrAat6z/M\nWZ1oMuR6Zn9436HZ9Zv3Nhm2Gkb+BgymlS+9zaR8kwzwf4xIrd/SOxi7nJv/WDs0\nkIeKnLVAvANhXFQ9VB3NfVI=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@kadircloudcom.iam.gserviceaccount.com",
  client_id: "102780990422357668131",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40kadircloudcom.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Firebase Admin SDK'yı başlat
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'kadircloudcom'
});

const db = admin.firestore();

// Test dokümanı oluştur
async function testFirestore() {
  try {
    console.log('🧪 Firestore bağlantısı test ediliyor...');
    
    // Test dokümanı oluştur
    await db.collection('_test').doc('permissions-test').set({
      message: 'Permissions test successful',
      timestamp: new Date(),
      test: true
    });
    
    console.log('✅ Firestore bağlantısı başarılı!');
    
    // Test dokümanını oku
    const doc = await db.collection('_test').doc('permissions-test').get();
    if (doc.exists) {
      console.log('✅ Doküman okuma başarılı!');
      console.log('📄 Doküman verisi:', doc.data());
    }
    
    // Poll test dokümanı oluştur
    await db.collection('polls').doc('test-poll').set({
      title: 'Test Poll',
      description: 'This is a test poll',
      options: ['Option 1', 'Option 2'],
      createdBy: 'test-user',
      createdAt: new Date(),
      isActive: true,
      totalVotes: 0
    });
    
    console.log('✅ Poll oluşturma testi başarılı!');
    
    // Wheel test dokümanı oluştur
    await db.collection('wheels').doc('test-wheel').set({
      title: 'Test Wheel',
      description: 'This is a test wheel',
      segments: [
        { title: 'Segment 1', color: '#FF0000', probability: 25 },
        { title: 'Segment 2', color: '#00FF00', probability: 25 },
        { title: 'Segment 3', color: '#0000FF', probability: 25 },
        { title: 'Segment 4', color: '#FFFF00', probability: 25 }
      ],
      createdBy: 'test-user',
      createdAt: new Date(),
      isActive: true,
      totalSpins: 0
    });
    
    console.log('✅ Wheel oluşturma testi başarılı!');
    
    console.log('\n🎉 Tüm testler başarılı!');
    console.log('📋 Firebase Console\'da Security Rules\'ları güncelleyin:');
    console.log('1. https://console.firebase.google.com');
    console.log('2. kadircloudcom projesini seçin');
    console.log('3. Firestore Database → Rules');
    console.log('4. SIMPLE_FIREBASE_RULES.md dosyasındaki rules\'ları kopyalayın');
    console.log('5. Publish butonuna tıklayın');
    
  } catch (error) {
    console.error('❌ Firestore test hatası:', error);
    console.log('\n🔧 Çözüm:');
    console.log('1. Firebase Console\'da Security Rules\'ları güncelleyin');
    console.log('2. SIMPLE_FIREBASE_RULES.md dosyasındaki rules\'ları kullanın');
  }
}

testFirestore();
