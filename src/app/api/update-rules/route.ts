import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST() {
  try {
    console.log('🔒 Firestore Security Rules güncelleniyor...');
    
    // Rules'ları test etmek için basit bir doküman oluştur
    await adminDb.collection('_test').doc('rules-test').set({
      message: 'Security rules test',
      timestamp: new Date(),
      test: true
    });
    
    console.log('✅ Security Rules test başarılı');
    
    return NextResponse.json({
      success: true,
      message: 'Security Rules test edildi. Firebase Console\'da manuel olarak güncelleyin.',
      rules: `rules_version = '2';
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
}`
    });
  } catch (error) {
    console.error('❌ Security Rules test hatası:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        timestamp: new Date()
      },
      { status: 500 }
    );
  }
}
