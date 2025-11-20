
export enum UserRole {
  USER = 'USER',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
  ABOUT = 'ABOUT',
  TERMS = 'TERMS',
  PRIVACY = 'PRIVACY',
  CONTACT = 'CONTACT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this should be hashed. Storing plain text for demo/localStorage.
  role: UserRole;
  isVerified: boolean;
  verificationCode?: string;
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
  name: string;
  isSubscribed: boolean;
  subscriptionPlanId?: string;
  subscriptionExpiry?: string;
}