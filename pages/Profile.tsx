
import React, { useState } from 'react';
import { User } from '../types';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  History, 
  Star, 
  Settings, 
  Eye, 
  EyeOff, 
  Heart,
  Calendar,
  ShieldCheck
} from 'lucide-react';

interface ProfileProps {
  user: User;
}

type Tab = 'INFO' | 'HISTORY' | 'WALLET' | 'REVIEWS' | 'PREFS';

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<Tab>('INFO');
  const [showPhone, setShowPhone] = useState(false);

  // MOCK DATA (Como não temos backend para isso ainda)
  const mockHistory = [
    { id: 1, event: 'Festival de Jazz de Luanda', date: '2025-04-15', status: 'Confirmado', price: 15000 },
    { id: 2, event: 'Workshop de Kizomba', date: '2024-12-20', status: 'Concluído', price: 5000 },
  ];

  const mockReviews = [
    { id: 1, event: 'Workshop de Kizomba', rating: 5, comment: 'Incrível! Aprendi muito.', type: 'GIVEN' },
    { id: 2, event: 'Show de Humor', rating: 4, comment: 'Muito bom, mas atrasou um pouco.', type: 'GIVEN' },
  ];

  const mockCards = [
    { id: 1, last4: '4242', brand: 'Visa', expiry: '12/28' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Header do Perfil */}
      <div className="relative bg-unikiala-surface border border-white/10 rounded-3xl p-6 md:p-10 mb-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-unikiala-pink/20 to-purple-900/20"></div>
        
        <div className="relative flex flex-col md:flex-row items-start md:items-end gap-6 mt-12">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-black rounded-full border-4 border-unikiala-surface flex items-center justify-center shadow-2xl overflow-hidden">
             {/* Placeholder Avatar */}
             <img 
               src={`https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=FF00FF&color=000`} 
               alt={user.name}
               className="w-full h-full object-cover"
             />
          </div>
          
          <div className="flex-grow mb-2">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white">{user.name}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
              <span className="flex items-center"><Mail className="w-4 h-4 mr-1" /> {user.email}</span>
              <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wide text-white">
                {user.role}
              </span>
              {user.isVerified && (
                <span className="flex items-center text-green-400 text-xs"><ShieldCheck className="w-3 h-3 mr-1" /> Verificado</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu Lateral */}
        <div className="lg:col-span-1 space-y-2">
          <TabButton active={activeTab === 'INFO'} onClick={() => setActiveTab('INFO')} icon={<UserIcon />} label="Dados Pessoais" />
          <TabButton active={activeTab === 'WALLET'} onClick={() => setActiveTab('WALLET')} icon={<CreditCard />} label="Carteira & Endereço" />
          <TabButton active={activeTab === 'HISTORY'} onClick={() => setActiveTab('HISTORY')} icon={<History />} label="Histórico de Reservas" />
          <TabButton active={activeTab === 'REVIEWS'} onClick={() => setActiveTab('REVIEWS')} icon={<Star />} label="Avaliações" />
          <TabButton active={activeTab === 'PREFS'} onClick={() => setActiveTab('PREFS')} icon={<Settings />} label="Preferências" />
        </div>

        {/* Conteúdo Principal */}
        <div className="lg:col-span-3 bg-unikiala-surface border border-white/10 rounded-3xl p-6 md:p-8 min-h-[400px]">
          
          {activeTab === 'INFO' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <UserIcon className="mr-3 text-unikiala-pink" /> Informações Pessoais
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Nome Completo</label>
                  <p className="text-white font-medium">{user.name}</p>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Email</label>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-1">
                     <label className="text-xs text-gray-500 uppercase font-bold">Telefone</label>
                     <button onClick={() => setShowPhone(!showPhone)} className="text-gray-400 hover:text-white">
                        {showPhone ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                     </button>
                  </div>
                  <p className="text-white font-medium">
                    {showPhone ? "+244 9XX XXX XXX" : "•••• ••• •••"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'WALLET' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <CreditCard className="mr-3 text-unikiala-pink" /> Métodos de Pagamento
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {mockCards.map(card => (
                   <div key={card.id} className="bg-gradient-to-br from-gray-800 to-black border border-white/10 p-6 rounded-xl flex flex-col justify-between h-40 relative overflow-hidden group hover:border-unikiala-pink/50 transition-colors">
                      <div className="flex justify-between items-start">
                         <span className="text-gray-400 font-mono uppercase tracking-widest text-xs">Cartão de Crédito</span>
                         <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-70 grayscale group-hover:grayscale-0 transition-all" />
                      </div>
                      <div className="text-xl text-white font-mono tracking-widest mt-4">
                         •••• •••• •••• {card.last4}
                      </div>
                      <div className="flex justify-between items-end mt-auto">
                         <div>
                            <span className="text-[10px] text-gray-500 block uppercase">Titular</span>
                            <span className="text-sm text-gray-300">{user.name.toUpperCase()}</span>
                         </div>
                         <div>
                            <span className="text-[10px] text-gray-500 block uppercase">Validade</span>
                            <span className="text-sm text-gray-300">{card.expiry}</span>
                         </div>
                      </div>
                   </div>
                ))}
                <button className="border-2 border-dashed border-white/10 hover:border-unikiala-pink rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:text-unikiala-pink transition-colors h-40">
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2">
                      <CreditCard className="w-5 h-5" />
                   </div>
                   <span className="text-sm font-bold">Adicionar Novo Cartão</span>
                </button>
              </div>

              <h3 className="text-xl font-bold text-white mb-4 flex items-center border-t border-white/10 pt-6">
                <MapPin className="mr-2 text-unikiala-pink w-5 h-5" /> Endereço de Cobrança
              </h3>
              <div className="bg-black/30 p-6 rounded-xl border border-white/5 flex items-start">
                 <div className="flex-grow">
                    <p className="text-white font-bold">Casa Principal</p>
                    <p className="text-gray-400 text-sm mt-1">Rua da Missão, 123, Ingombota</p>
                    <p className="text-gray-400 text-sm">Luanda, Angola</p>
                 </div>
                 <button className="text-xs text-unikiala-pink font-bold hover:underline">Editar</button>
              </div>
            </div>
          )}

          {activeTab === 'HISTORY' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <History className="mr-3 text-unikiala-pink" /> Histórico de Reservas
              </h2>

              <div className="space-y-4">
                 {mockHistory.map(item => (
                    <div key={item.id} className="bg-black/30 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-white/5 transition-colors">
                       <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                             <Calendar className="text-white w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="font-bold text-white">{item.event}</h4>
                             <p className="text-sm text-gray-400">{item.date}</p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between w-full md:w-auto gap-6">
                          <span className="text-unikiala-pink font-bold">
                             {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(item.price)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                             item.status === 'Confirmado' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-300'
                          }`}>
                             {item.status}
                          </span>
                       </div>
                    </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'REVIEWS' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Star className="mr-3 text-unikiala-pink" /> Minhas Avaliações
              </h2>
              
              <div className="space-y-4">
                 {mockReviews.map(review => (
                    <div key={review.id} className="bg-black/30 p-6 rounded-xl border border-white/5">
                       <div className="flex justify-between mb-2">
                          <h4 className="font-bold text-white">{review.event}</h4>
                          <div className="flex text-yellow-500">
                             {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-700'}`} />
                             ))}
                          </div>
                       </div>
                       <p className="text-gray-300 italic">"{review.comment}"</p>
                    </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'PREFS' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Heart className="mr-3 text-unikiala-pink" /> Preferências
               </h2>

               <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Interesses</h3>
                  <div className="flex flex-wrap gap-2">
                     {['Música ao Vivo', 'Teatro', 'Kizomba', 'Semba', 'Arte Moderna', 'Gastronomia', 'Workshops'].map(tag => (
                        <span key={tag} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:border-unikiala-pink hover:text-unikiala-pink cursor-pointer transition-colors text-sm">
                           {tag}
                        </span>
                     ))}
                  </div>
               </div>

               <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Idioma & Acessibilidade</h3>
                  <div className="flex flex-wrap gap-4">
                     <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-unikiala-pink">
                        <option>Português (AO)</option>
                        <option>Inglês (EN)</option>
                     </select>
                     <label className="flex items-center text-gray-300">
                        <input type="checkbox" className="mr-2 accent-unikiala-pink" />
                        Acessibilidade para cadeirantes
                     </label>
                  </div>
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-6 py-4 rounded-xl transition-all duration-300 mb-2 font-bold ${
      active 
        ? 'bg-unikiala-pink text-black shadow-neon translate-x-2' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </button>
);
