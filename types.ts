
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
