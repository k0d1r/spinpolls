# 🔒 Firebase Security Rules Güncelleme Rehberi

## 🚨 ÖNEMLİ: Bu adımları takip edin!

### 1. Firebase Console'a Gidin
- [Firebase Console](https://console.firebase.google.com) adresine gidin
- `kadircloudcom` projenizi seçin

### 2. Firestore Database'e Gidin
- Sol menüden **"Firestore Database"** seçin
- **"Rules"** sekmesine tıklayın

### 3. Mevcut Rules'ları Değiştirin
Aşağıdaki rules'ları kopyalayıp yapıştırın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Allow reading user data for authentication
      allow read: if request.auth != null;
    }
    
    // Polls collection
    match /polls/{pollId} {
      // Anyone can read active polls
      allow read: if resource.data.isActive == true;
      
      // Only authenticated users can create polls
      allow create: if request.auth != null 
        && request.auth.uid == resource.data.createdBy;
      
      // Only poll creator can update their polls
      allow update: if request.auth != null 
        && request.auth.uid == resource.data.createdBy;
      
      // Only poll creator can delete their polls
      allow delete: if request.auth != null 
        && request.auth.uid == resource.data.createdBy;
    }
    
    // Poll votes collection
    match /pollVotes/{voteId} {
      // Anyone can create votes (for anonymous voting)
      allow create: if true;
      
      // No one can read individual votes (privacy)
      allow read: if false;
      
      // No one can update or delete votes
      allow update, delete: if false;
    }
    
    // Wheels collection
    match /wheels/{wheelId} {
      // Anyone can read active wheels
      allow read: if resource.data.isActive == true;
      
      // Only authenticated users can create wheels
      allow create: if request.auth != null 
        && request.auth.uid == resource.data.createdBy;
      
      // Only wheel creator can update their wheels
      allow update: if request.auth != null 
        && request.auth.uid == resource.data.createdBy;
      
      // Only wheel creator can delete their wheels
      allow delete: if request.auth != null 
        && request.auth.uid == resource.data.createdBy;
    }
    
    // Wheel spins collection
    match /wheelSpins/{spinId} {
      // Anyone can create spins (for anonymous spinning)
      allow create: if true;
      
      // No one can read individual spins (privacy)
      allow read: if false;
      
      // No one can update or delete spins
      allow update, delete: if false;
    }
    
    // Setup documents (for testing)
    match /_setup/{document} {
      allow read, write: if true;
    }
    
    // Test documents
    match /_test/{document} {
      allow read, write: if true;
    }
  }
}
```

### 4. Rules'ları Yayınlayın
- **"Publish"** butonuna tıklayın
- Onay verin

### 5. Authentication'ı Etkinleştirin
- Sol menüden **"Authentication"** seçin
- **"Get started"** butonuna tıklayın
- **"Sign-in method"** sekmesine gidin
- **"Google"** provider'ını etkinleştirin
- **"Email/Password"** provider'ını etkinleştirin

### 6. Test Edin
- [http://localhost:3000/firebase-test](http://localhost:3000/firebase-test) adresine gidin
- **"Firebase'i Yapılandır"** butonuna tıklayın
- **"Security Rules Güncelle"** butonuna tıklayın

## ✅ Tamamlandıktan Sonra
- Anket oluşturabilirsiniz
- Çark oluşturabilirsiniz
- Giriş yapabilirsiniz
- Tüm sayfalar Türkçe olacak

## 🆘 Sorun Yaşarsanız
1. Firebase Console'da proje seçimini kontrol edin
2. Rules'ların doğru kopyalandığını kontrol edin
3. Authentication provider'larının etkin olduğunu kontrol edin
4. Tarayıcı konsolunda hata mesajlarını kontrol edin
