
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
    description: 'Uma noite mágica com os melhores saxofonistas de Angola e convidados internacionais na orla da capital.',
    category: 'Música',
    date: '2025-04-15',
    location: 'Baía de Luanda',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop',
    organizerId: 'org1',
    organizerWhatsapp: '244900000000',
    highlighted: true,
    coordinates: { lat: -8.8147, lng: 13.2302 }
  },
  {
    id: '2',
    title: 'Exposição: Futurismo Africano',
    description: 'Obras inéditas de jovens artistas angolanos explorando a tecnologia e tradição em instalações imersivas.',
    category: 'Arte & Exposição',
    date: '2025-05-20',
    location: 'Galeria H.O',
    price: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1000&auto=format&fit=crop',
    organizerId: 'org2',
    organizerWhatsapp: '244900000000',
    highlighted: false,
    coordinates: { lat: -8.8205, lng: 13.2405 }
  },
  {
    id: '3',
    title: 'Teatro: As Vedetas do Mussulo',
    description: 'Uma comédia emocionante que retrata a vida cotidiana e os sonhos das gentes do litoral.',
    category: 'Teatro',
    date: '2025-06-05',
    location: 'Elinga Teatro',
    price: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1000&auto=format&fit=crop',
    organizerId: 'org1',
    organizerWhatsapp: '244900000000',
    highlighted: true,
    coordinates: { lat: -8.8118, lng: 13.2356 }
  },
  {
    id: '4',
    title: 'Workshop: Kizomba & Semba Masterclass',
    description: 'Aprenda os passos fundamentais e as variações modernas das danças que conquistaram o mundo.',
    category: 'Workshop',
    date: '2025-03-28',
    location: 'Centro Cultural Agostinho Neto',
    price: 10000,
    imageUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=1000&auto=format&fit=crop',
    organizerId: 'org3',
    organizerWhatsapp: '244900000000',
    highlighted: false,
    coordinates: { lat: -8.8350, lng: 13.2340 }
  },
  {
    id: '5',
    title: 'Sabores de Angola: Festival Gastronómico',
    description: 'Um tour pelos sabores das 18 províncias. Funge, Muamba e iguarias típicas em um só lugar.',
    category: 'Gastronomia',
    date: '2025-07-12',
    location: 'Ilha do Cabo',
    price: 20000,
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
    organizerId: 'org2',
    organizerWhatsapp: '244900000000',
    highlighted: true,
    coordinates: { lat: -8.7890, lng: 13.2210 }
  },
  {
    id: '6',
    title: 'Stand-up Comedy: Luanda a Rir',
    description: 'Os maiores humoristas da nova geração em uma noite de gargalhadas garantidas sobre a nossa "banda".',
    category: 'Outros',
    date: '2025-04-02',
    location: 'Centro de Conferências de Belas',
    price: 7500,
    imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedee6?q=80&w=1000&auto=format&fit=crop',
    organizerId: 'org4',
    organizerWhatsapp: '244900000000',
    highlighted: false,
    coordinates: { lat: -8.9220, lng: 13.1850 }
  }
];
