import { Event } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_EVENTS } from '../constants';

const LOCAL_STORAGE_KEY = 'unikiala_local_events';

// Helper para pegar eventos locais
const getLocalEvents = (): Event[] => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

// Helper para salvar evento localmente
const saveLocalEvent = (event: Event) => {
  const current = getLocalEvents();
  const updated = [event, ...current];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
};

// Helper para remover evento local
const removeLocalEvent = (id: string) => {
  const current = getLocalEvents();
  const updated = current.filter(e => e.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
};

export const eventService = {
  getEvents: async (): Promise<Event[]> => {
    let dbEvents: Event[] = [];

    // 1. Tenta buscar do Supabase se configurado
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (!error && data) {
          dbEvents = data.map((e: any) => ({
            id: e.id,
            title: e.title,
            description: e.description,
            date: e.date,
            location: e.location,
            price: Number(e.price),
            imageUrl: e.image_url,
            organizerId: e.organizer_id,
            organizerWhatsapp: e.organizer_whatsapp,
            highlighted: e.highlighted,
            coordinates: e.coordinates
          }));
        }
      } catch (err) {
        console.warn("Erro ao conectar Supabase, usando dados locais.");
      }
    }

    // 2. Busca eventos salvos localmente (criados offline ou por admin local)
    const localEvents = getLocalEvents();

    // 3. Combina tudo: Initial -> Local -> DB
    // A ordem é importante: o último array (dbEvents) vai sobrescrever duplicatas no Map se tiverem o mesmo ID.
    // Isso garante que se você deletou algo do LocalStorage ou editou no DB, a versão mais robusta prevalece.
    const allEvents = [...INITIAL_EVENTS, ...localEvents, ...dbEvents];
    
    // Remove duplicatas baseadas no ID
    const uniqueEvents = Array.from(new Map(allEvents.map(item => [item.id, item])).values());

    // Ordenar por data
    return uniqueEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  createEvent: async (eventData: Omit<Event, 'id'>): Promise<Event | null> => {
    const tempId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const localEventObj: Event = {
      id: tempId,
      ...eventData,
      organizerWhatsapp: eventData.organizerWhatsapp || '',
      highlighted: eventData.highlighted || false
    };

    // Se não tiver Supabase ou User, salva local e retorna sucesso
    if (!isSupabaseConfigured) {
      saveLocalEvent(localEventObj);
      return localEventObj;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Se não tiver usuário logado no Supabase (ex: Admin Backdoor), salva local
      if (!user) {
        saveLocalEvent(localEventObj);
        return localEventObj;
      }

      // Tenta salvar no Supabase
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            location: eventData.location,
            price: eventData.price,
            image_url: eventData.imageUrl,
            organizer_id: user.id,
            organizer_whatsapp: eventData.organizerWhatsapp,
            highlighted: eventData.highlighted,
            coordinates: eventData.coordinates
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Falha ao salvar no DB, salvando localmente:', error);
        saveLocalEvent(localEventObj);
        return localEventObj;
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        date: data.date,
        location: data.location,
        price: Number(data.price),
        imageUrl: data.image_url,
        organizerId: data.organizer_id,
        organizerWhatsapp: data.organizer_whatsapp,
        highlighted: data.highlighted,
        coordinates: data.coordinates
      };
    } catch (err) {
      console.error("Exceção crítica, salvando localmente:", err);
      saveLocalEvent(localEventObj);
      return localEventObj;
    }
  },

  deleteEvent: async (eventId: string): Promise<boolean> => {
    // 1. Tenta remover do LocalStorage primeiro
    removeLocalEvent(eventId);

    // 2. Se configurado, tenta remover do Supabase
    if (isSupabaseConfigured) {
        try {
            const { error } = await supabase.from('events').delete().eq('id', eventId);
            if (error) {
                console.warn("Erro ao deletar do Supabase (pode ser um evento apenas local ou inicial):", error.message);
            }
        } catch (e) {
            console.error("Erro ao deletar:", e);
        }
    }
    
    return true;
  }
};