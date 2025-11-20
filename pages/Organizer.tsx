import React, { useState, useCallback, useRef } from 'react';
import { Event, Plan, OrganizerProfile } from '../types';
import { SUBSCRIPTION_PLANS } from '../constants';
import { generateEventDescription } from '../services/geminiService';
import { Check, Loader2, Sparkles, Zap, Phone, CreditCard, ArrowLeft, Upload, Image as ImageIcon, X } from 'lucide-react';

interface OrganizerProps {
  organizer: OrganizerProfile;
  onSubscribe: (planId: string) => void;
  onAddEvent: (event: Omit<Event, 'id'>) => Promise<boolean>;
}

export const Organizer: React.FC<OrganizerProps> = ({ organizer, onSubscribe, onAddEvent }) => {
  const [showPlans, setShowPlans] = useState(false);

  // Determina se mostra os planos:
  // 1. Se não for assinante (obrigatório ver planos)
  // 2. Se for assinante mas clicou para ver planos (showPlans = true)
  const shouldShowPlans = !organizer.isSubscribed || showPlans;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 pb-6 border-b border-white/10 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">Área do Produtor</h1>
          <p className="text-gray-400 text-base md:text-lg">Gerencie seus eventos e alcance milhares de pessoas.</p>
        </div>
        
        <div className="flex flex-col md:items-end gap-2">
          <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 w-fit">
            <span className="text-gray-500 text-sm uppercase tracking-wider">Status: </span>
            <span className={`font-bold ${organizer.isSubscribed ? 'text-green-400' : 'text-unikiala-pink'}`}>
              {organizer.isSubscribed ? 'Assinante Ativo' : 'Plano Gratuito'}
            </span>
          </div>

          {organizer.isSubscribed && (
            <button 
              onClick={() => setShowPlans(!showPlans)}
              className="flex items-center text-sm font-bold text-unikiala-pink hover:text-white transition-colors p-2 md:p-0"
            >
              {showPlans ? (
                <>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Eventos
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" /> Ver Planos / Upgrade
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {shouldShowPlans ? (
        <div className="animate-in fade-in duration-500">
           {organizer.isSubscribed && (
            <div className="mb-6">
               <button 
                onClick={() => setShowPlans(false)}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
               >
                 <ArrowLeft className="w-5 h-5 mr-2" /> Voltar ao Painel de Controle
               </button>
            </div>
           )}
          <SubscriptionSection onSubscribe={onSubscribe} />
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          <CreateEventSection onAddEvent={onAddEvent} />
        </div>
      )}
    </div>
  );
};

const SubscriptionSection: React.FC<{ onSubscribe: (id: string) => void }> = ({ onSubscribe }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);
  };

  return (
    <div className="text-center">
      <div className="mb-10 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 md:mb-6">Potencialize seus Eventos</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg px-4">
          Escolha o plano ideal para destacar suas atividades culturais no UNIKIALA.
          Visibilidade garantida e ferramentas exclusivas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
        {SUBSCRIPTION_PLANS.map((plan, index) => {
          const isElite = plan.price === 1000000;
          
          return (
            <div 
              key={plan.id} 
              className={`
                relative flex flex-col p-6 md:p-8 rounded-3xl transition-all duration-300 hover:-translate-y-3
                ${isElite 
                  ? 'bg-gradient-to-b from-gray-900 to-black border border-unikiala-pink shadow-neon' 
                  : 'bg-unikiala-surface border border-white/10 hover:border-white/30'}
              `}
            >
              {isElite && (
                 <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-unikiala-pink text-black font-bold px-4 py-1 rounded-full text-sm shadow-lg flex items-center whitespace-nowrap">
                   <Sparkles className="w-4 h-4 mr-1" /> RECOMENDADO
                 </div>
              )}
              
              <div className="mb-8">
                <h3 className={`text-lg font-bold uppercase tracking-widest mb-4 ${isElite ? 'text-unikiala-pink' : 'text-gray-400'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl md:text-4xl font-display font-bold text-white">
                    {formatCurrency(plan.price)}
                  </span>
                </div>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>

              <ul className="flex-grow space-y-4 mb-10 text-left text-sm md:text-base">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-gray-300">
                    <div className={`mt-1 mr-3 p-1 rounded-full flex-shrink-0 ${isElite ? 'bg-unikiala-pink text-black' : 'bg-gray-800 text-gray-400'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSubscribe(plan.id)}
                className={`
                  w-full py-4 rounded-xl font-bold transition-all duration-300
                  ${isElite 
                    ? 'bg-unikiala-pink text-black hover:bg-white hover:scale-105 shadow-neon' 
                    : 'bg-white/10 text-white hover:bg-white hover:text-black'}
                `}
              >
                Selecionar Plano
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CreateEventSection: React.FC<{ onAddEvent: (event: Omit<Event, 'id'>) => Promise<boolean> }> = ({ onAddEvent }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateDescription = useCallback(async () => {
    if (!title) return;
    setIsGenerating(true);
    const generated = await generateEventDescription(title, details);
    setDescription(generated);
    setIsGenerating(false);
  }, [title, details]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("A imagem é muito grande. Por favor, escolha uma imagem menor que 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    const success = await onAddEvent({
      title,
      description,
      date,
      location,
      price: Number(price),
      imageUrl,
      organizerId: 'current_user',
      organizerWhatsapp: whatsapp.replace(/\D/g, ''), // Remove non-digits
      highlighted: true 
    });

    setIsSubmitting(false);

    if (success) {
      alert('Evento publicado com sucesso!');
    } else {
      alert('Erro ao criar evento. Tente novamente.');
    }
  };

  const inputClass = "w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:border-unikiala-pink focus:ring-1 focus:ring-unikiala-pink outline-none transition-all";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1";
  const requiredMark = <span className="text-red-500 ml-1" title="Obrigatório">*</span>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-unikiala-pink/20 p-6 rounded-3xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Zap className="text-unikiala-pink mr-2" /> Dica Pro
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Imagens de alta qualidade e descrições criativas aumentam em até 60% a venda de ingressos. 
            Use nossa ferramenta de IA para criar textos envolventes.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            <strong className="text-white">Importante:</strong> Adicione um número de WhatsApp válido. As vendas serão finalizadas diretamente por lá.
          </p>
        </div>

        {/* Preview Box in Sidebar (Optional, but keeps context) */}
        <div className="bg-unikiala-surface border border-white/10 p-4 rounded-3xl">
             <label className={labelClass}>Pré-visualização</label>
             <div className="rounded-2xl overflow-hidden aspect-video relative group">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-white text-xs font-bold">Capa do Evento</span>
                </div>
             </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-unikiala-surface p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8 flex items-center">
          Nova Atividade
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          {/* Image Upload Section */}
          <div>
            <label className={labelClass}>Imagem de Capa {requiredMark}</label>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <div 
              onClick={triggerFileInput}
              className="w-full h-64 border-2 border-dashed border-gray-700 hover:border-unikiala-pink hover:bg-white/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden"
            >
              {imageUrl && !imageUrl.includes('unsplash') ? (
                <>
                  <img src={imageUrl} alt="Uploaded" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                  <div className="relative z-10 flex flex-col items-center">
                     <div className="p-4 bg-black/50 rounded-full backdrop-blur-sm mb-2 group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-8 h-8 text-unikiala-pink" />
                     </div>
                     <span className="text-white font-bold text-sm shadow-black drop-shadow-md">Clique para alterar imagem</span>
                  </div>
                </>
              ) : (
                <>
                   <div className="p-4 bg-white/5 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-gray-400 group-hover:text-unikiala-pink" />
                   </div>
                   <p className="text-gray-400 font-medium group-hover:text-white">Clique para fazer upload da capa</p>
                   <p className="text-gray-600 text-xs mt-1">PNG, JPG ou WEBP (Max 5MB)</p>
                </>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>Título do Evento {requiredMark}</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="Ex: Show de Kizomba ao Luar"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Data {requiredMark}</label>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
               <label className={labelClass}>Preço (AOA) {requiredMark}</label>
              <input
                required
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={inputClass}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label className={labelClass}>Localização {requiredMark}</label>
              <input
                required
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
                placeholder="Ex: Cine Atlântico"
              />
            </div>
            <div>
              <label className={labelClass}>WhatsApp para Vendas {requiredMark}</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  required
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className={`${inputClass} pl-10`}
                  placeholder="Ex: 244923456789"
                />
              </div>
            </div>
          </div>

          <div className="border border-unikiala-pink/30 p-6 rounded-2xl bg-unikiala-pink/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-24 h-24 text-unikiala-pink" />
            </div>
            <label className="block text-unikiala-pink font-bold mb-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Assistente de IA (Gemini)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-black/60 border border-unikiala-pink/20 rounded-xl p-4 text-white text-sm mb-4 focus:border-unikiala-pink outline-none"
              placeholder="Digite palavras-chave: Jazz, Vinho, Pôr do sol, Romântico..."
              rows={2}
            />
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={!title || isGenerating}
              className="w-full md:w-auto text-sm bg-black hover:bg-gray-900 text-white border border-gray-700 px-5 py-2.5 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : <Sparkles className="mr-2 w-4 h-4 text-unikiala-pink" />}
              Gerar Descrição Automática
            </button>
          </div>

          <div>
            <label className={labelClass}>Descrição Final</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} h-40`}
              placeholder="A descrição do evento aparecerá aqui..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-unikiala-pink text-black font-bold text-lg py-4 rounded-xl hover:bg-white hover:shadow-neon transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 w-6 h-6" />
                Publicando Atividade...
              </>
            ) : (
              'Publicar Atividade'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};