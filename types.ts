
export enum UserRole {
  USER = 'USER',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
  ABOUT = 'ABOUT',
  TERMS = 'TERMS',
  PRIVACY = 'PRIVACY',
  CONTACT = 'CONTACT',
  PROFILE = 'PROFILE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; 
  role: UserRole;
  isVerified: boolean;
  verificationCode?: string;
  avatarUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category?: string; // Novo campo
  date: string;
  location: string;
  price: number;
  imageUrl: string;
  organizerId: string;
  organizerWhatsapp: string;
  highlighted: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  // Novos campos para analytics
  ticketsSold?: number;
  revenue?: number;
  status?: 'ACTIVE' | 'DRAFT' | 'PAST' | 'CANCELLED';
}

export interface Plan {
  id: string;
  name: string;
  durationMonths: number;
  price: number;
  features: string[];
}

export interface OrganizerProfile {
  id: string;
  name: string; // Nome da Empresa ou Artístico
  email?: string;
  nif?: string;
  bio?: string;
  category?: string;
  logoUrl?: string;
  isSubscribed: boolean;
  subscriptionPlanId?: string;
  subscriptionExpiry?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'UNSUBMITTED';
  balance: number;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  status: 'COMPLETED' | 'PENDING';
}

export interface VerificationDocument {
  id: string;
  name: string;
  type: 'CONTRACT' | 'ID' | 'LICENSE';
  uploadDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface TicketStats {
  checkInCount: number;
  totalSold: number;
  revenue: number;
}

// --- NEW TYPES FOR COMMUNITY FEATURES ---

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Comment {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  organizerReply?: string;
  organizerReplyAt?: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId?: string;
  guestName: string;
  ticketCode: string;
  qrUrl?: string;
  category: string;
  pricePaid: number;
  status: 'VALID' | 'USED' | 'CANCELLED';
  usedAt?: string;
  createdAt: string;
}

export interface Favorite {
  userId: string;
  eventId: string;
  createdAt: string;
}
