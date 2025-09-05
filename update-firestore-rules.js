// Firebase Firestore Rules güncelleme scripti
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

// Firestore Rules'ları güncelle
const rules = `rules_version = '2';
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
}`;

console.log('Firestore Rules güncelleniyor...');
console.log('Rules dosyası hazır. Firebase Console\'da manuel olarak güncelleyin.');
console.log('Rules:', rules);
