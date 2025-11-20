import { Event } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_EVENTS } from '../constants';

export const eventService = {
  getEvents: async (): Promise<Event[]> => {
    // Se não tiver chaves configuradas, retorna os eventos mockados imediatamente
    // Isso evita o erro 404 de tentar bater na URL placeholder
    if (!isSupabaseConfigured) {
      console.log('Modo Demonstração: Usando eventos locais.');
      return INITIAL_EVENTS;
    }

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Erro ao buscar eventos:', error);
      return INITIAL_EVENTS; // Fallback para dados iniciais se falhar
    }

    if (!data || data.length === 0) {
      return INITIAL_EVENTS; // Mostra eventos fictícios se o banco estiver vazio
    }

    return data.map((e: any) => ({
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
  },

  createEvent: async (event: Omit<Event, 'id'>): Promise<Event | null> => {
    if (!isSupabaseConfigured) {
      alert("Aviso: Banco de dados não conectado. O evento não será salvo permanentemente.");
      // Retorna um mock para a UI parecer que funcionou
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...event,
        organizerWhatsapp: event.organizerWhatsapp || '',
        highlighted: event.highlighted || false
      };
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location,
          price: event.price,
          image_url: event.imageUrl,
          organizer_id: user.id,
          organizer_whatsapp: event.organizerWhatsapp,
          highlighted: event.highlighted,
          coordinates: event.coordinates
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
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
  }
};