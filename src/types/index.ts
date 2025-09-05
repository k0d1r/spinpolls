export interface Poll {
  id: string;
  title: string;
  description?: string;
  options: PollOption[];
  createdAt: Date;
  createdBy: string;
  isActive: boolean;
  totalVotes: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  color: string;
}

export interface PollVote {
  id: string;
  pollId: string;
  optionId: string;
  votedAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface Wheel {
  id: string;
  title: string;
  description?: string;
  segments: WheelSegment[];
  createdAt: Date;
  createdBy: string;
  isActive: boolean;
  totalSpins: number;
}

export interface WheelSegment {
  id: string;
  text: string;
  color: string;
  probability: number; // 0-1
  spins: number;
}

export interface WheelSpin {
  id: string;
  wheelId: string;
  segmentId: string;
  spunAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
}
