# Firebase Kurulum Rehberi

## 🔥 Firebase Authentication Hatası Çözümü

`auth/configuration-not-found` hatası, Firebase projenizde Authentication'ın etkinleştirilmediğini gösterir.

## 📋 Adım Adım Çözüm

### 1. Firebase Console'a Gidin
- [Firebase Console](https://console.firebase.google.com) adresine gidin
- Projenizi seçin: **kadircloudcom**

### 2. Authentication'ı Etkinleştirin
1. Sol menüden **"Authentication"** seçin
2. **"Get started"** butonuna tıklayın
3. **"Sign-in method"** sekmesine gidin

### 3. Sign-in Provider'ları Yapılandırın

#### Google Sign-in
1. **"Google"** provider'ını seçin
2. **"Enable"** toggle'ını açın
3. **Project support email** seçin
4. **"Save"** butonuna tıklayın

#### Email/Password
1. **"Email/Password"** provider'ını seçin
2. **"Enable"** toggle'ını açın
3. **"Save"** butonuna tıklayın

### 4. Firestore Database'i Etkinleştirin
1. Sol menüden **"Firestore Database"** seçin
2. **"Create database"** butonuna tıklayın
3. **"Start in test mode"** seçin (geliştirme için)
4. **"Next"** → **"Done"**

### 5. Security Rules'ları Ayarlayın
1. **"Rules"** sekmesine gidin
2. Aşağıdaki kuralları yapıştırın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Polls collection
    match /polls/{pollId} {
      allow read: if resource.data.isActive == true;
      allow create: if request.auth != null && request.auth.uid == resource.data.createdBy;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.createdBy;
    }
    
    // Poll votes collection
    match /pollVotes/{voteId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    
    // Wheels collection
    match /wheels/{wheelId} {
      allow read: if resource.data.isActive == true;
      allow create: if request.auth != null && request.auth.uid == resource.data.createdBy;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.createdBy;
    }
    
    // Wheel spins collection
    match /wheelSpins/{spinId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

3. **"Publish"** butonuna tıklayın

### 6. Test Edin
1. Uygulamanızı yeniden başlatın: `npm run dev`
2. [http://localhost:3000/firebase-test](http://localhost:3000/firebase-test) adresine gidin
3. Firebase yapılandırmasının doğru olduğunu kontrol edin

## 🚨 Yaygın Hatalar ve Çözümleri

### "Project not found" Hatası
- Firebase Console'da doğru projeyi seçtiğinizden emin olun
- Proje ID'sinin `kadircloudcom` olduğunu kontrol edin

### "Permission denied" Hatası
- Security Rules'ları doğru yapıştırdığınızdan emin olun
- Rules'ları **"Publish"** ettiğinizden emin olun

### "Invalid API key" Hatası
- Firebase Console'da **"Project Settings"** → **"General"** sekmesine gidin
- **"Web apps"** bölümünden API key'i kopyalayın
- `src/lib/firebase.ts` dosyasındaki `apiKey` değerini güncelleyin

## ✅ Başarılı Kurulum Kontrolü

Firebase kurulumu başarılı olduğunda:
- ✅ Authentication çalışacak
- ✅ Google Sign-in çalışacak
- ✅ Email/Password kayıt/giriş çalışacak
- ✅ Firestore veritabanı çalışacak
- ✅ Security Rules aktif olacak

## 📞 Yardım

Eğer hala sorun yaşıyorsanız:
1. Firebase Console'da **"Support"** bölümüne bakın
2. [Firebase Dokümantasyonu](https://firebase.google.com/docs) inceleyin
3. Hata mesajlarını kontrol edin

---

**Not**: Bu rehber, `kadircloudcom` Firebase projesi için hazırlanmıştır. Farklı bir proje kullanıyorsanız, yapılandırma değerlerini güncelleyin.
