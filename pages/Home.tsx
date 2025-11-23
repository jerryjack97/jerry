
import React, { useState, useEffect, useRef } from 'react';
import { Event } from '../types';
import { Calendar, MapPin, Search, ArrowRight, X, Truck, Store, MessageCircle, DollarSign, Map as MapIcon, Filter, Tag, Zap, Smartphone, CheckCircle, Loader2, Heart, Share2, Download, Printer } from 'lucide-react';

// Declare Leaflet global to avoid TS errors since we import it via CDN
declare const L: any;

interface HomeProps {
  events: Event[];
}

const CATEGORIES = ['Todos', 'Música', 'Teatro', 'Arte & Exposição', 'Workshop', 'Festivais', 'Gastronomia', 'Infantil', 'Outros'];

export const Home: React.FC<HomeProps> = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  // Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('unikiala_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const eventsSectionRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);
  };

  const handleBuyClick = (event: Event) => {
    setSelectedEvent(event);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedEvent(null);
  };

  const handleExploreClick = () => {
    eventsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
  };

  const toggleFavorite = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavs = prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId];
      localStorage.setItem('unikiala_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const handleShare = async (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: event.title,
      text: `Confira este evento incrível no UNIKIALA: ${event.title} em ${event.location}.`,
      url: window.location.href // Em produção, seria a URL específica do evento
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      // Fallback para WhatsApp Web
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  // Lógica de Filtro de Busca Robusta
  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchTerm || (() => {
      const term = searchTerm.toLowerCase().trim();
      const title = (event.title || '').toLowerCase();
      const location = (event.location || '').toLowerCase();
      const description = (event.description || '').toLowerCase();
      const category = (event.category || '').toLowerCase();
      return title.includes(term) || location.includes(term) || description.includes(term) || category.includes(term);
    })();

    const matchesCategory = selectedCategory === 'Todos' || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredEvents = filteredEvents.filter(e => e.highlighted);
  const regularEvents = filteredEvents.filter(e => !e.highlighted);

  return (
    <div className="pb-20 relative">
      {/* Checkout Modal */}
      {isCheckoutOpen && selectedEvent && (
        <CheckoutModal 
          event={selectedEvent} 
          onClose={closeCheckout} 
          formatCurrency={formatCurrency} 
        />
      )}

      {/* Hero Section */}
      <div className="relative min-h-[80vh] md:h-[600px] w-full overflow-hidden flex items-center justify-center mb-12 md:mb-16">
        {/* Background Image with Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-unikiala-black via-black/80 to-black/40 z-10"></div>
        
        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto text-center px-4 mt-16 md:mt-10 flex flex-col justify-center h-full">
          <div className="inline-block px-4 py-1 border border-unikiala-pink/50 rounded-full bg-black/50 backdrop-blur-md mb-4 md:mb-6 self-center">
            <span className="text-unikiala-pink font-bold text-xs md:text-sm tracking-widest uppercase">A Cultura vive aqui</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-4 md:mb-6 leading-tight">
            Descubra a Alma <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-unikiala-pink to-purple-600">Vibrante de Angola</span>
          </h1>
          <p className="text-gray-300 text-base md:text-xl max-w-2xl mx-auto mb-8 md:mb-10 font-light px-2">
            Garanta seu lugar nos melhores concertos, teatros e exposições. Viva experiências inesquecíveis.
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-2xl mx-auto bg-black/40 md:bg-white/10 backdrop-blur-lg border border-white/20 p-3 rounded-3xl md:rounded-full flex flex-col md:flex-row items-center shadow-2xl gap-3 md:gap-0 transition-all focus-within:border-unikiala-pink/50 focus-within:bg-black/60">
            <div className="flex items-center w-full md:w-auto flex-grow relative">
              <Search className="text-gray-400 w-5 h-5 ml-2 md:ml-4 shrink-0" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busque por evento, artista ou local..." 
                className="flex-grow bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 px-4 h-10 outline-none w-full text-sm md:text-base"
                autoComplete="off"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 p-1 text-gray-400 hover:text-white bg-white/10 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button 
              onClick={handleExploreClick}
              className="w-full md:w-auto bg-unikiala-pink hover:bg-unikiala-pinkDim text-black font-bold px-8 py-3 rounded-xl md:rounded-full transition-all shadow-neon hover:shadow-neon-hover"
            >
              Explorar
            </button>
          </div>

          {/* Category Filters */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
             {CATEGORIES.map(cat => (
                <button
                   key={cat}
                   onClick={() => setSelectedCategory(cat)}
                   className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                      selectedCategory === cat 
                      ? 'bg-unikiala-pink text-black border-unikiala-pink shadow-neon' 
                      : 'bg-black/30 text-gray-300 border-white/10 hover:border-white/30 hover:text-white'
                   }`}
                >
                   {cat}
                </button>
             ))}
          </div>
        </div>
      </div>

      <div ref={eventsSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* Resultados da Busca (Contador) */}
        {(searchTerm || selectedCategory !== 'Todos') && (
          <div className="mb-8 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 bg-white/5 p-4 rounded-xl border border-white/10">
             <Filter className="w-4 h-4 text-unikiala-pink" />
             <span className="text-gray-400 text-sm">
               Exibindo <strong className="text-white">{filteredEvents.length}</strong> eventos 
               {selectedCategory !== 'Todos' && <span> em <strong className="text-unikiala-pink">{selectedCategory}</strong></span>}
               {searchTerm && <span> para busca "<strong className="text-white">{searchTerm}</strong>"</span>}
             </span>
             <button onClick={clearSearch} className="ml-auto text-xs font-bold text-unikiala-pink hover:underline flex items-center">
                <X className="w-3 h-3 mr-1" /> Limpar Filtros
             </button>
          </div>
        )}

        {/* MAP SECTION */}
        <section className="mb-12 md:mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center mb-6 md:mb-8">
             <div className="p-2 bg-unikiala-pink/20 rounded-full mr-4 border border-unikiala-pink/50">
               <MapIcon className="w-6 h-6 text-unikiala-pink" />
             </div>
             <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Mapa de Eventos</h2>
                <p className="text-gray-400 text-sm">Encontre atividades culturais perto de si</p>
             </div>
          </div>
          <div className="h-[350px] md:h-[450px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-neon relative z-0">
            <EventMap events={filteredEvents} onEventClick={handleBuyClick} />
          </div>
        </section>

        {/* Search No Results Feedback */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 mb-12">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-400">
               Não encontramos resultados para os filtros selecionados.
               {selectedCategory !== 'Todos' && <span className="block mt-1">Tente mudar a categoria de "{selectedCategory}" para "Todos".</span>}
            </p>
            <button onClick={clearSearch} className="mt-6 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition-colors">
               Limpar todos os filtros
            </button>
          </div>
        )}

        {/* Destaques Section */}
        {featuredEvents.length > 0 && (
          <section className="mb-12 md:mb-20">
            <div className="flex items-end justify-between mb-6 md:mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Em Destaque</h2>
                <div className="h-1 w-20 bg-unikiala-pink rounded-full"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  formatCurrency={formatCurrency} 
                  featured 
                  onBuy={() => handleBuyClick(event)}
                  isFavorite={favorites.includes(event.id)}
                  onToggleFavorite={(e) => toggleFavorite(event.id, e)}
                  onShare={(e) => handleShare(event, e)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Todos Eventos Section */}
        {regularEvents.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 md:mb-8 flex items-center">
              <span className="w-1.5 md:w-2 h-6 md:h-8 bg-gray-700 mr-3 md:mr-4 rounded-full"></span>
              Próximos Eventos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {regularEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  formatCurrency={formatCurrency}
                  onBuy={() => handleBuyClick(event)}
                  isFavorite={favorites.includes(event.id)}
                  onToggleFavorite={(e) => toggleFavorite(event.id, e)}
                  onShare={(e) => handleShare(event, e)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// --- Map Component ---
const EventMap: React.FC<{ events: Event[]; onEventClick: (e: Event) => void }> = ({ events, onEventClick }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default to Luanda
    const defaultLat = -8.839988;
    const defaultLng = 13.289437;

    if (!mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 13);
      
      // Use CartoDB Dark Matter tiles for the neon theme
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    events.forEach(event => {
      if (event.coordinates) {
        // Custom circle marker to fit theme
        const marker = L.circleMarker([event.coordinates.lat, event.coordinates.lng], {
          radius: 8,
          fillColor: '#FF00FF', // Unikiala Pink
          color: '#fff',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map);

        // Bind Popup
        const popupContent = `
          <div style="font-family: 'Outfit', sans-serif; color: #000; text-align: center;">
            <h3 style="font-weight: bold; margin-bottom: 5px;">${event.title}</h3>
            <p style="font-size: 12px; margin-bottom: 8px;">${event.location}</p>
            <button id="btn-${event.id}" style="background-color: #FF00FF; color: white; border: none; padding: 5px 10px; border-radius: 4px; font-weight: bold; cursor: pointer;">
              Ver Detalhes
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);

        // Handle popup open to attach event listener to button
        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-${event.id}`);
          if (btn) {
            btn.onclick = () => {
               onEventClick(event);
               map.closePopup();
            };
          }
        });
        
        markersRef.current.push(marker);
      }
    });

    // Cleanup handled by markersRef management
  }, [events, onEventClick]);

  return <div ref={mapContainerRef} className="w-full h-full bg-[#050505]" />;
};

interface CheckoutModalProps {
  event: Event;
  onClose: () => void;
  formatCurrency: (v: number) => string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ event, onClose, formatCurrency }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryZone, setDeliveryZone] = useState<'inside' | 'outside'>('inside');
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'WHATSAPP' | 'KWIK'>('WHATSAPP');
  const [kwikPhone, setKwikPhone] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');

  // Taxas
  const TAX_INSIDE = 2000;
  const TAX_OUTSIDE = 5000;

  const getDeliveryFee = () => {
    if (deliveryMethod === 'pickup') return 0;
    return deliveryZone === 'inside' ? TAX_INSIDE : TAX_OUTSIDE;
  };

  const total = (event.price * quantity) + getDeliveryFee();

  const handleCheckout = async () => {
    if (!name) {
      alert("Por favor, insira seu nome.");
      return;
    }

    if (paymentMethod === 'KWIK') {
       if (!kwikPhone) {
          alert("Por favor, insira o número de telefone associado ao Kwik.");
          return;
       }

       setIsProcessingPayment(true);
       
       // Simulação de Chamada API Kwik
       // Num cenário real, aqui chamaríamos o endpoint /payments/request da Kwik
       setTimeout(() => {
          setIsProcessingPayment(false);
          setPaymentSuccess(true);
          setPaymentRef(`KWIK-${Math.floor(Math.random() * 1000000)}`);
       }, 3000); // 3 segundos de simulação
       return;
    }

    // Fluxo Padrão (WhatsApp/Manual)
    finishAndOpenWhatsApp();
  };

  const finishAndOpenWhatsApp = () => {
     const deliveryText = deliveryMethod === 'pickup' 
      ? 'Levantamento Presencial (Sem taxa)' 
      : `Delivery (${deliveryZone === 'inside' ? 'Mesma Província' : 'Outra Província'})`;

    const paymentStatus = paymentSuccess 
      ? `✅ *PAGO VIA KWIK* (Ref: ${paymentRef})`
      : `⏳ *Pagamento Pendente* (A tratar no atendimento)`;

    const message = `*NOVO PEDIDO - UNIKIALA*\n\n` +
      `🎟 *Evento:* ${event.title}\n` +
      `🏷 *Categoria:* ${event.category || 'Geral'}\n` +
      `📍 *Local:* ${event.location}\n` +
      `📅 *Data:* ${new Date(event.date).toLocaleDateString()}\n` +
      `--------------------------------\n` +
      `👤 *Cliente:* ${name}\n` +
      `🔢 *Qtd:* ${quantity}\n` +
      `🚚 *Entrega:* ${deliveryText}\n` +
      `💰 *Total:* ${formatCurrency(total)}\n` +
      `💳 *Status:* ${paymentStatus}\n\n` +
      (paymentSuccess ? `O pagamento já foi confirmado. Aguardo o envio dos ingressos.` : `Gostaria de finalizar o pagamento.`);

    const whatsappUrl = `https://wa.me/${event.organizerWhatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handlePrintTicket = (ticketCode: string, qrCodeUrl: string) => {
    const printWindow = window.open('', '', 'width=420,height=700');
    if (printWindow) {
      printWindow.document.write(`
        <html>
            <head>
              <title>UNIKIALA Ticket - ${name}</title>
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet">
              <style>
                  body { background-color: #050505; color: white; font-family: 'Outfit', sans-serif; display: flex; justify-content: center; padding: 20px; margin: 0; }
                  .ticket { width: 100%; max-width: 350px; border: 1px solid #333; border-radius: 20px; overflow: hidden; background: #111; position: relative; box-shadow: 0 10px 30px rgba(255,0,255,0.2); }
                  .header { background: linear-gradient(135deg, #FF00FF, #800080); padding: 20px; text-align: center; }
                  .content { padding: 30px; text-align: center; }
                  .qr-container { background: #000; padding: 10px; border-radius: 12px; border: 1px solid #333; display: inline-block; margin: 20px 0; }
                  .label { font-size: 10px; text-transform: uppercase; color: #666; font-weight: 700; margin-bottom: 2px; }
                  .value { font-size: 16px; font-weight: 600; margin-bottom: 15px; color: white; }
                  .code { font-family: monospace; font-size: 20px; color: #FF00FF; font-weight: bold; letter-spacing: 2px; margin: 0; }
                  @media print { 
                    body { background: none; } 
                    .ticket { border: 1px solid #000; box-shadow: none; } 
                    .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                  }
              </style>
            </head>
            <body>
              <div class="ticket">
                  <div class="header">
                    <h1 style="font-family: 'Syne'; margin:0; font-size: 24px;">UNIKIALA</h1>
                    <p style="margin:0; font-size: 10px; font-weight: bold; opacity: 0.8; text-transform: uppercase; letter-spacing: 2px;">Bilhete Digital Oficial</p>
                  </div>
                  <div class="content">
                    <h2 style="margin:0 0 5px 0; font-family: 'Syne';">${event.title}</h2>
                    <p style="color: #888; font-size: 12px; margin-bottom: 20px;">${new Date(event.date).toLocaleDateString()}</p>
                    
                    <div class="qr-container">
                        <img src="${qrCodeUrl}" width="180" height="180"/>
                    </div>
                    
                    <div style="text-align: left;">
                        <div class="label">Titular</div>
                        <div class="value">${name}</div>
                        
                        <div class="label">Categoria</div>
                        <div class="value">${event.category || 'Geral'}</div>
                    </div>
                    
                    <div style="border-top: 1px dashed #333; margin: 20px 0;"></div>

                    <div class="label">Código de Validação</div>
                    <p class="code">${ticketCode}</p>
                  </div>
              </div>
              <script>
                  setTimeout(() => window.print(), 800);
              </script>
            </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Se o pagamento Kwik foi sucesso, mostrar o BILHETE DIGITAL AUTOMATICAMENTE
  if (paymentSuccess) {
    const ticketCode = paymentRef || `TIX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticketCode}&color=FF00FF&bgcolor=000000&margin=1`;

     return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
           <div className="relative bg-unikiala-surface border border-unikiala-pink/50 rounded-3xl w-full max-w-sm p-0 overflow-hidden shadow-neon animate-in zoom-in duration-300">
              
              {/* Ticket Header */}
              <div className="bg-gradient-to-r from-unikiala-pink to-purple-800 p-6 text-center relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <h3 className="font-display font-bold text-2xl text-white relative z-10">UNIKIALA</h3>
                <p className="text-black font-bold text-xs uppercase tracking-widest bg-white/20 inline-block px-3 py-1 rounded mt-2 relative z-10">Bilhete Oficial</p>
              </div>

              {/* Ticket Body */}
              <div className="p-6 bg-black text-center relative">
                 <h4 className="text-xl font-bold text-white mb-1">{event.title}</h4>
                 <p className="text-gray-400 text-sm mb-6">{new Date(event.date).toLocaleDateString()}</p>

                 <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6 inline-block shadow-lg">
                    <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto rounded-lg" />
                 </div>

                 <div className="text-center mb-6">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Titular</p>
                    <p className="text-white font-bold text-lg mb-3">{name}</p>
                    
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Código de Validação</p>
                    <p className="text-unikiala-pink font-mono text-xl tracking-widest">{ticketCode}</p>
                 </div>

                 <div className="space-y-3">
                    <button 
                       onClick={() => handlePrintTicket(ticketCode, qrCodeUrl)}
                       className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                       <Printer className="w-4 h-4 mr-2" /> Imprimir / Salvar PDF
                    </button>
                    <button 
                       onClick={onClose}
                       className="w-full bg-white/5 text-gray-400 font-bold py-3 rounded-xl hover:bg-white/10 transition-colors"
                    >
                       Fechar
                    </button>
                 </div>
              </div>
              
              {/* Decorative Perforation Circles */}
              <div className="absolute top-[88px] -left-3 w-6 h-6 bg-unikiala-surface rounded-full"></div>
              <div className="absolute top-[88px] -right-3 w-6 h-6 bg-unikiala-surface rounded-full"></div>
           </div>
        </div>
     );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Responsive Modal Container */}
      <div className="relative bg-unikiala-surface border-t md:border border-white/10 rounded-t-3xl md:rounded-3xl w-full max-w-md shadow-neon overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in duration-300 flex flex-col max-h-[90vh]">
        
        <div className="bg-gradient-to-r from-unikiala-pink/20 to-purple-900/20 p-4 md:p-6 border-b border-white/10 flex justify-between items-start shrink-0">
          <div>
            <h3 className="text-lg md:text-xl font-display font-bold text-white mb-1">Finalizar Compra</h3>
            <p className="text-gray-400 text-xs md:text-sm">{event.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 bg-white/5 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto custom-scrollbar">
          {/* Resumo do Evento */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-2">
            <h4 className="text-xs font-bold text-unikiala-pink uppercase mb-2">Detalhes do Evento</h4>
            <div className="flex items-center text-sm text-gray-300">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span>{new Date(event.date).toLocaleDateString('pt-AO')}</span>
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
              <span>{event.location}</span>
            </div>
             <div className="flex items-center text-sm text-gray-300">
              <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
              <span>{formatCurrency(event.price)} / pessoa</span>
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Seu Nome</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:border-unikiala-pink outline-none"
              placeholder="Digite seu nome completo"
            />
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quantidade</label>
            <div className="flex items-center space-x-4">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/20 text-white font-bold">-</button>
              <span className="text-xl font-bold text-white">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/20 text-white font-bold">+</button>
            </div>
          </div>

          {/* Método de Entrega */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Entrega</label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button 
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${deliveryMethod === 'pickup' ? 'bg-unikiala-pink/10 border-unikiala-pink text-white' : 'bg-black/30 border-gray-800 text-gray-500'}`}
              >
                <Store className="w-6 h-6 mb-1" />
                <span className="text-xs font-bold">Levantamento</span>
              </button>
              <button 
                onClick={() => setDeliveryMethod('delivery')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${deliveryMethod === 'delivery' ? 'bg-unikiala-pink/10 border-unikiala-pink text-white' : 'bg-black/30 border-gray-800 text-gray-500'}`}
              >
                <Truck className="w-6 h-6 mb-1" />
                <span className="text-xs font-bold">Delivery</span>
              </button>
            </div>

            {deliveryMethod === 'delivery' && (
              <div className="bg-white/5 p-3 rounded-xl space-y-2 animate-in slide-in-from-top-2">
                <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-white/5 rounded-lg">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="zone" 
                      checked={deliveryZone === 'inside'} 
                      onChange={() => setDeliveryZone('inside')}
                      className="mr-3 accent-unikiala-pink" 
                    />
                    <span className="text-sm text-gray-300">Na Província</span>
                  </div>
                  <span className="text-sm font-bold text-unikiala-pink">+2.000 Kzs</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-white/5 rounded-lg">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="zone" 
                      checked={deliveryZone === 'outside'} 
                      onChange={() => setDeliveryZone('outside')}
                      className="mr-3 accent-unikiala-pink" 
                    />
                    <span className="text-sm text-gray-300">Fora da Província</span>
                  </div>
                  <span className="text-sm font-bold text-unikiala-pink">+5.000 Kzs</span>
                </label>
              </div>
            )}
          </div>

          {/* Pagamento com Kwik */}
          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Forma de Pagamento</label>
             <div className="space-y-3">
                <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'WHATSAPP' ? 'bg-white/10 border-unikiala-pink text-white' : 'bg-black/30 border-gray-800 text-gray-500'}`}>
                   <input type="radio" name="payment" checked={paymentMethod === 'WHATSAPP'} onChange={() => setPaymentMethod('WHATSAPP')} className="mr-3 accent-unikiala-pink" />
                   <MessageCircle className="w-5 h-5 mr-3 text-green-500" />
                   <span className="font-bold text-sm">Pagar no WhatsApp / Local</span>
                </label>

                <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'KWIK' ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-black/30 border-gray-800 text-gray-500'}`}>
                   <input type="radio" name="payment" checked={paymentMethod === 'KWIK'} onChange={() => setPaymentMethod('KWIK')} className="mr-3 accent-blue-500" />
                   <Zap className="w-5 h-5 mr-3 text-blue-400" />
                   <span className="font-bold text-sm">Kwik Instant Payment</span>
                   <span className="ml-auto text-xs bg-blue-500 text-black px-2 py-0.5 rounded font-bold">Rápido</span>
                </label>

                {paymentMethod === 'KWIK' && (
                   <div className="pl-4 animate-in slide-in-from-top-2">
                      <p className="text-xs text-blue-300 mb-2">Insira seu nº Kwik para autorizar o pagamento:</p>
                      <div className="flex items-center bg-black/50 border border-blue-500/50 rounded-xl px-3 py-2">
                         <Smartphone className="w-4 h-4 text-blue-400 mr-2" />
                         <input 
                           type="tel" 
                           placeholder="923 xxx xxx" 
                           value={kwikPhone}
                           onChange={e => setKwikPhone(e.target.value)}
                           className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600"
                        />
                      </div>
                   </div>
                )}
             </div>
          </div>

          {/* Resumo */}
          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Ingressos ({quantity}x)</span>
              <span>{formatCurrency(event.price * quantity)}</span>
            </div>
            {deliveryMethod === 'delivery' && (
              <div className="flex justify-between text-sm text-gray-400">
                <span>Taxa de Entrega</span>
                <span>{formatCurrency(getDeliveryFee())}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-white pt-2">
              <span>Total</span>
              <span className="text-unikiala-pink">{formatCurrency(total)}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={isProcessingPayment}
            className={`w-full font-bold py-4 rounded-xl flex items-center justify-center transition-all shadow-lg ${
               paymentMethod === 'KWIK' 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50' 
                  : 'bg-[#25D366] hover:bg-[#20bd5a] text-black shadow-green-900/50'
            } ${isProcessingPayment ? 'opacity-80 cursor-wait' : ''}`}
          >
            {isProcessingPayment ? (
               <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Aguardando aprovação Kwik...
               </>
            ) : (
               <>
                  {paymentMethod === 'KWIK' ? <Zap className="w-5 h-5 mr-2" /> : <MessageCircle className="w-5 h-5 mr-2" />}
                  {paymentMethod === 'KWIK' ? 'Pagar com Kwik' : 'Confirmar Pedido'}
               </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface EventCardProps { 
  event: Event; 
  formatCurrency: (v: number) => string; 
  featured?: boolean; 
  onBuy: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, formatCurrency, featured, onBuy, isFavorite, onToggleFavorite, onShare 
}) => (
  <div className={`
    group relative bg-unikiala-surface rounded-2xl overflow-hidden flex flex-col
    ${featured ? 'border border-unikiala-pink/30 hover:border-unikiala-pink' : 'border border-white/5 hover:border-white/20'} 
    transition-all duration-500 hover:-translate-y-2
    ${featured ? 'hover:shadow-neon' : 'hover:shadow-2xl'}
  `}>
    <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden flex-shrink-0">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10"></div>
      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      
      {/* Price Badge */}
      <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold px-3 py-1 rounded-lg text-xs md:text-sm">
        {formatCurrency(event.price)}
      </div>

      {/* Action Buttons Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={onToggleFavorite}
          className="p-2 bg-black/60 hover:bg-unikiala-pink/80 hover:text-white backdrop-blur-md rounded-full border border-white/10 transition-colors"
          title="Salvar nos Favoritos"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-unikiala-pink text-unikiala-pink' : 'text-white'}`} />
        </button>
        <button 
          onClick={onShare}
          className="p-2 bg-black/60 hover:bg-blue-500/80 hover:text-white backdrop-blur-md rounded-full border border-white/10 transition-colors"
          title="Compartilhar"
        >
          <Share2 className="w-5 h-5 text-white" />
        </button>
      </div>
      
      <div className="absolute bottom-4 left-4 z-20 flex gap-2">
        <span className="bg-unikiala-pink text-black text-[10px] md:text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
          {event.highlighted ? 'Destaque' : 'Evento'}
        </span>
        {event.category && (
           <span className="bg-black/60 border border-white/20 text-white backdrop-blur text-[10px] md:text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
              {event.category}
           </span>
        )}
      </div>
    </div>
    
    <div className="p-4 md:p-6 relative flex flex-col flex-grow">
      <h3 className="text-lg md:text-xl font-display font-bold text-white mb-3 leading-tight group-hover:text-unikiala-pink transition-colors line-clamp-2">
        {event.title}
      </h3>
      
      <div className="space-y-2 mb-4 flex-grow">
        <div className="flex items-center text-gray-400 text-xs md:text-sm">
          <Calendar className="w-4 h-4 mr-2 text-unikiala-pink shrink-0" />
          <span>{new Date(event.date).toLocaleDateString('pt-AO', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
        <div className="flex items-center text-gray-400 text-xs md:text-sm">
          <MapPin className="w-4 h-4 mr-2 text-unikiala-pink shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>

      <p className="text-gray-500 text-xs md:text-sm mb-6 line-clamp-2">{event.description}</p>
      
      <button 
        onClick={onBuy}
        className="w-full py-3 rounded-xl bg-white/5 hover:bg-unikiala-pink text-white hover:text-black font-bold border border-white/10 hover:border-unikiala-pink transition-all duration-300 mt-auto text-sm md:text-base"
      >
        Comprar Ingresso
      </button>
    </div>
  </div>
);
