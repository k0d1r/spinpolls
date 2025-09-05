import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Poll, PollVote, Wheel, WheelSpin, UserData } from '@/types';

// Polls
export const createPoll = async (pollData: Omit<Poll, 'id' | 'createdAt' | 'totalVotes'>) => {
  const docRef = await addDoc(collection(db, 'polls'), {
    ...pollData,
    createdAt: Timestamp.now(),
    totalVotes: 0,
  });
  return docRef.id;
};

export const getPoll = async (pollId: string): Promise<Poll | null> => {
  const docRef = doc(db, 'polls', pollId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
    } as Poll;
  }
  return null;
};

export const getUserPolls = async (userId: string): Promise<Poll[]> => {
  const q = query(
    collection(db, 'polls'),
    where('createdBy', '==', userId)
  );
  
  const querySnapshot = await getDocs(q);
  const polls = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  })) as Poll[];
  
  return polls.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const votePoll = async (pollId: string, optionId: string) => {
  // Add vote record
  await addDoc(collection(db, 'pollVotes'), {
    pollId,
    optionId,
    votedAt: Timestamp.now(),
  });
  
  // Update poll option votes
  const poll = await getPoll(pollId);
  if (poll) {
    const updatedOptions = poll.options.map(option => 
      option.id === optionId 
        ? { ...option, votes: option.votes + 1 }
        : option
    );
    
    await updateDoc(doc(db, 'polls', pollId), {
      options: updatedOptions,
      totalVotes: poll.totalVotes + 1,
    });
  }
};

export const subscribeToPoll = (pollId: string, callback: (poll: Poll | null) => void) => {
  const docRef = doc(db, 'polls', pollId);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Poll);
    } else {
      callback(null);
    }
  });
};

// Wheels
export const createWheel = async (wheelData: Omit<Wheel, 'id' | 'createdAt' | 'totalSpins'>) => {
  const docRef = await addDoc(collection(db, 'wheels'), {
    ...wheelData,
    createdAt: Timestamp.now(),
    totalSpins: 0,
  });
  return docRef.id;
};

export const getWheel = async (wheelId: string): Promise<Wheel | null> => {
  const docRef = doc(db, 'wheels', wheelId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
    } as Wheel;
  }
  return null;
};

export const getUserWheels = async (userId: string): Promise<Wheel[]> => {
  const q = query(
    collection(db, 'wheels'),
    where('createdBy', '==', userId)
  );
  
  const querySnapshot = await getDocs(q);
  const wheels = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  })) as Wheel[];
  
  return wheels.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const spinWheel = async (wheelId: string, segmentId: string) => {
  // Add spin record
  await addDoc(collection(db, 'wheelSpins'), {
    wheelId,
    segmentId,
    spunAt: Timestamp.now(),
  });
  
  // Update wheel segment spins
  const wheel = await getWheel(wheelId);
  if (wheel) {
    const updatedSegments = wheel.segments.map(segment => 
      segment.id === segmentId 
        ? { ...segment, spins: segment.spins + 1 }
        : segment
    );
    
    await updateDoc(doc(db, 'wheels', wheelId), {
      segments: updatedSegments,
      totalSpins: wheel.totalSpins + 1,
    });
  }
};

export const subscribeToWheel = (wheelId: string, callback: (wheel: Wheel | null) => void) => {
  const docRef = doc(db, 'wheels', wheelId);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Wheel);
    } else {
      callback(null);
    }
  });
};
