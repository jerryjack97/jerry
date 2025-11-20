import { Event } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_EVENTS } from '../constants';

export const eventService = {
  getEvents: async (): Promise<Event[]> => {
    // Se não tiver chaves configuradas, retorna os eventos mockados imediatamente
    if (!isSupabaseConfigured) {
      console.log('Modo Demonstração: Usando eventos locais.');
      return INITIAL_EVENTS;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.warn('Erro ao buscar eventos no Supabase (pode ser falta de tabela):', error.message);
        return INITIAL_EVENTS; 
      }

      if (!data || data.length === 0) {
        return INITIAL_EVENTS; 
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
    } catch (err) {
      console.error("Erro inesperado ao buscar eventos:", err);
      return INITIAL_EVENTS;
    }
  },

  createEvent: async (event: Omit<Event, 'id'>): Promise<Event | null> => {
    // Função auxiliar para criar evento localmente (Mock)
    const createLocalMock = () => ({
      id: Math.random().toString(36).substr(2, 9),
      ...event,
      organizerWhatsapp: event.organizerWhatsapp || '',
      highlighted: event.highlighted || false
    });

    if (!isSupabaseConfigured) {
      alert("Modo Demonstração: Banco de dados não conectado. O evento será exibido temporariamente.");
      return createLocalMock();
    }

    try {
      // Verifica sessão real no Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      // Se estiver logado como Admin Backdoor (authService), user será null no Supabase.
      // Nesse caso, salvamos localmente para não quebrar a demo.
      if (!user) {
        console.warn("Usuário Admin/Demo detectado. Salvando evento localmente.");
        alert("Aviso: Você está logado como Admin local. O evento será salvo apenas nesta sessão.");
        return createLocalMock();
      }

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
        console.error('Erro ao criar evento no Supabase:', error);
        alert(`Erro ao salvar no banco: ${error.message}. Salvando localmente.`);
        return createLocalMock();
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
      console.error("Exceção ao criar evento:", err);
      return createLocalMock();
    }
  }
};