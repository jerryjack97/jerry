
import { Plan, Event } from './types';

export const SUBSCRIPTION_PLANS: Plan[] = [
  {
    id: 'plan_1',
    name: 'Mensal - Destaque',
    durationMonths: 1,
    price: 300000,
    features: ['Eventos ilimitados', 'Destaque por 1 mês', 'Suporte básico']
  },
  {
    id: 'plan_2',
    name: 'Bimestral - Pro',
    durationMonths: 2,
    price: 500000,
    features: ['Eventos ilimitados', 'Destaque por 2 meses', 'Análise de dados', 'Suporte prioritário']
  },
  {
    id: 'plan_3',
    name: 'Semestral - Elite',
    durationMonths: 5,
    price: 1000000,
    features: ['Eventos ilimitados', 'Destaque por 5 meses', 'Marketing dedicado', 'Gestor de conta']
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Festival de Jazz de Luanda',
    description: 'Uma noite mágica com os melhores saxofonistas de Angola e convidados internacionais.',
    category: 'Música',
    date: '2025-04-15',
    location: 'Baía de Luanda',
    price: 15000,
    imageUrl: 'https://picsum.photos/800/600?random=1',
    organizerId: 'org1',
    organizerWhatsapp: '244900000000',
    highlighted: true,
    coordinates: { lat: -8.8147, lng: 13.2302 } // Baía de Luanda area
  },
  {
    id: '2',
    title: 'Exposição de Arte Contemporânea',
    description: 'Obras inéditas de jovens artistas angolanos explorando o futurismo africano.',
    category: 'Arte & Exposição',
    date: '2025-05-20',
    location: 'Galeria H.O',
    price: 5000,
    imageUrl: 'https://picsum.photos/800/600?random=2',
    organizerId: 'org2',
    organizerWhatsapp: '244900000000',
    highlighted: false,
    coordinates: { lat: -8.8205, lng: 13.2405 } // Generic downtown area
  },
  {
    id: '3',
    title: 'Teatro: O Regresso',
    description: 'Uma peça emocionante sobre raízes e reencontros.',
    category: 'Teatro',
    date: '2025-06-05',
    location: 'Elinga Teatro',
    price: 8000,
    imageUrl: 'https://picsum.photos/800/600?random=3',
    organizerId: 'org1',
    organizerWhatsapp: '244900000000',
    highlighted: true,
    coordinates: { lat: -8.8118, lng: 13.2356 } // Near Elinga Teatro
  }
];