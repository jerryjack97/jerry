
import React, { useState, useRef, useCallback } from 'react';
import { Event, OrganizerProfile, FinancialTransaction, VerificationDocument } from '../types';
import { generateEventDescription } from '../services/geminiService';
import { 
  LayoutDashboard, Calendar, DollarSign, BarChart3, ShieldCheck, Settings, 
  QrCode, MessageSquare, Plus, Upload, Image as ImageIcon, Sparkles, 
  Loader2, Phone, Check, X, FileText, TrendingUp, Wallet, Bell, Search, 
  ChevronRight, Download, AlertCircle 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

interface OrganizerProps {
  organizer: OrganizerProfile;
  onSubscribe: (planId: string) => void;
  onAddEvent: (event: Omit<Event, 'id'>) => Promise<boolean>;
  onGoHome: () => void;
}

type Tab = 'DASHBOARD' | 'EVENTS' | 'FINANCE' | 'ANALYTICS' | 'CHECKIN' | 'PROFILE' | 'DOCS';

export const Organizer: React.FC<OrganizerProps> = ({ organizer: initialOrganizer, onSubscribe, onAddEvent, onGoHome }) => {
  const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');
  const [organizer, setOrganizer] = useState<OrganizerProfile>({
    ...initialOrganizer,
    balance: 1250000, // Saldo Mock
    verificationStatus: initialOrganizer.verificationStatus || 'UNSUBMITTED',
    nif: '500123456',
    category: 'Música e Festivais'
  });

  // MOCK DATA
  const transactions: FinancialTransaction[] = [
    { id: '1', date: '2025-02-20', description: 'Venda de Ingressos - Festival Jazz', amount: 45000, type: 'CREDIT', status: 'COMPLETED' },
    { id: '2', date: '2025-02-19', description: 'Venda de Ingressos - Festival Jazz', amount: 15000, type: 'CREDIT', status: 'COMPLETED' },
    { id: '3', date: '2025-02-18', description: 'Assinatura Plano Mensal', amount: -300000, type: 'DEBIT', status: 'COMPLETED' },
  ];

  const documents: VerificationDocument[] = [
    { id: '1', name: 'Alvará Comercial', type: 'LICENSE', uploadDate: '2025-01-10', status: 'APPROVED' },
    { id: '2', name: 'Identidade do Sócio', type: 'ID', uploadDate: '2025-01-12', status: 'PENDING' },
  ];

  const salesData = [
    { name: 'Seg', vendas: 4000 },
    { name: 'Ter', vendas: 3000 },
    { name: 'Qua', vendas: 2000 },
    { name: 'Qui', vendas: 2780 },
    { name: 'Sex', vendas: 18900 },
    { name: 'Sáb', vendas: 23900 },
    { name: 'Dom', vendas: 34900 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'DASHBOARD': return <DashboardHome organizer={organizer} salesData={salesData} />;
      case 'EVENTS': return <EventsManager onAddEvent={onAddEvent} isSubscribed={organizer.isSubscribed} />;
      case 'FINANCE': return <FinancialHub organizer={organizer} transactions={transactions} />;
      case 'ANALYTICS': return <AnalyticsView data={salesData} />;
      case 'CHECKIN': return <CheckInTool />;
      case 'PROFILE': return <CompanyProfile organizer={organizer} />;
      case 'DOCS': return <VerificationCenter docs={documents} status={organizer.verificationStatus} />;
      default: return <DashboardHome organizer={organizer} salesData={salesData} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-unikiala-black">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 bg-unikiala-surface border-r border-white/5 fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-unikiala-pink rounded-lg flex items-center justify-center text-black font-bold text-xl font-display">
            {organizer.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-white text-sm truncate w-32">{organizer.name}</h2>
            <span className="text-xs text-gray-400">Painel do Produtor</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
          <NavButton active={activeTab === 'DASHBOARD'} onClick={() => setActiveTab('DASHBOARD')} icon={<LayoutDashboard />} label="Visão Geral" />
          <NavButton active={activeTab === 'EVENTS'} onClick={() => setActiveTab('EVENTS')} icon={<Calendar />} label="Meus Eventos" />
          <NavButton active={activeTab === 'FINANCE'} onClick={() => setActiveTab('FINANCE')} icon={<Wallet />} label="Financeiro" />
          <NavButton active={activeTab === 'ANALYTICS'} onClick={() => setActiveTab('ANALYTICS')} icon={<BarChart3 />} label="Estatísticas" />
          <NavButton active={activeTab === 'CHECKIN'} onClick={() => setActiveTab('CHECKIN')} icon={<QrCode />} label="Check-in / Validação" />
          
          <div className="pt-6 mt-6 border-t border-white/10">
            <p className="px-4 text-xs font-bold text-gray-500 uppercase mb-2">Configurações</p>
            <NavButton active={activeTab === 'PROFILE'} onClick={() => setActiveTab('PROFILE')} icon={<Settings />} label="Dados da Empresa" />
            <NavButton active={activeTab === 'DOCS'} onClick={() => setActiveTab('DOCS')} icon={<ShieldCheck />} label="Verificação" />
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={onGoHome} className="flex items-center w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
             <ChevronRight className="w-4 h-4 mr-2 rotate-180" /> Voltar ao Site
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden mb-6 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-unikiala-pink rounded flex items-center justify-center font-bold text-black">
                 {organizer.name.charAt(0)}
              </div>
              <span className="font-bold text-white">Área do Produtor</span>
           </div>
           {/* Mobile Nav Dropdown could go here, utilizing simple select for now in complex implementation */}
           <select 
              value={activeTab} 
              onChange={(e) => setActiveTab(e.target.value as Tab)}
              className="bg-white/10 border-none rounded-lg text-white text-sm"
           >
              <option value="DASHBOARD">Visão Geral</option>
              <option value="EVENTS">Eventos</option>
              <option value="FINANCE">Financeiro</option>
              <option value="CHECKIN">Check-in</option>
           </select>
        </div>

        {renderContent()}
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 mb-1 font-medium text-sm ${
      active 
        ? 'bg-unikiala-pink/10 text-unikiala-pink border border-unikiala-pink/20' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <span className="mr-3 w-5 h-5">{icon}</span>
    {label}
  </button>
);

const DashboardHome: React.FC<{ organizer: OrganizerProfile, salesData: any[] }> = ({ organizer, salesData }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Olá, {organizer.name} 👋</h1>
        <p className="text-gray-400">Aqui está o resumo da sua performance hoje.</p>
      </div>
      <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 relative">
        <Bell className="w-5 h-5 text-gray-300" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-unikiala-pink rounded-full"></span>
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard label="Saldo Disponível" value="1.250.000 Kz" icon={<Wallet className="text-unikiala-pink" />} />
      <StatCard label="Ingressos Vendidos (Mês)" value="1,459" icon={<FileText className="text-purple-400" />} />
      <StatCard label="Eventos Ativos" value="3" icon={<Calendar className="text-green-400" />} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-unikiala-surface p-6 rounded-3xl border border-white/5">
        <h3 className="font-bold text-white mb-6">Receita Semanal</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF00FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF00FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#666" tickLine={false} axisLine={false} />
              <YAxis stroke="#666" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="vendas" stroke="#FF00FF" fillOpacity={1} fill="url(#colorVendas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-unikiala-surface p-6 rounded-3xl border border-white/5">
        <h3 className="font-bold text-white mb-4">Ações Rápidas</h3>
        <div className="space-y-3">
           <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl flex items-center text-white transition-colors border border-white/5">
              <div className="p-2 bg-unikiala-pink/20 rounded-lg mr-3"><Plus className="w-4 h-4 text-unikiala-pink" /></div>
              Criar Novo Evento
           </button>
           <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl flex items-center text-white transition-colors border border-white/5">
              <div className="p-2 bg-green-500/20 rounded-lg mr-3"><Download className="w-4 h-4 text-green-500" /></div>
              Solicitar Saque
           </button>
           <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl flex items-center text-white transition-colors border border-white/5">
              <div className="p-2 bg-blue-500/20 rounded-lg mr-3"><MessageSquare className="w-4 h-4 text-blue-500" /></div>
              Suporte
           </button>
        </div>
      </div>
    </div>
  </div>
);

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-unikiala-surface p-6 rounded-2xl border border-white/5">
    <div className="flex justify-between items-start mb-4">
      <span className="text-gray-400 text-sm font-medium">{label}</span>
      <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
    </div>
    <h3 className="text-2xl font-display font-bold text-white">{value}</h3>
  </div>
);

const FinancialHub: React.FC<{ organizer: OrganizerProfile, transactions: FinancialTransaction[] }> = ({ organizer, transactions }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <h2 className="text-2xl font-bold text-white">Carteira & Financeiro</h2>
    
    <div className="bg-gradient-to-r from-gray-900 to-black border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
       <div>
          <p className="text-gray-400 uppercase tracking-widest text-sm mb-2">Saldo Disponível</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
             {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(organizer.balance)}
          </h1>
          <p className="text-xs text-gray-500 mt-2">*Valores livres de taxas da plataforma</p>
       </div>
       <div className="flex gap-4">
          <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors">
             Adicionar Conta Bancária
          </button>
          <button className="bg-unikiala-pink hover:bg-white text-black px-6 py-3 rounded-xl font-bold shadow-neon transition-all">
             Solicitar Saque
          </button>
       </div>
    </div>

    <div className="bg-unikiala-surface border border-white/5 rounded-3xl overflow-hidden">
       <div className="p-6 border-b border-white/5">
          <h3 className="font-bold text-white">Extrato Recente</h3>
       </div>
       <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-black/20 text-gray-400 text-sm font-display">
                <tr>
                   <th className="p-4 font-normal">Data</th>
                   <th className="p-4 font-normal">Descrição</th>
                   <th className="p-4 font-normal">Tipo</th>
                   <th className="p-4 font-normal text-right">Valor</th>
                   <th className="p-4 font-normal text-center">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5 text-sm">
                {transactions.map(tx => (
                   <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-gray-300">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="p-4 text-white font-medium">{tx.description}</td>
                      <td className="p-4">
                         <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${tx.type === 'CREDIT' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {tx.type === 'CREDIT' ? 'Entrada' : 'Saída'}
                         </span>
                      </td>
                      <td className={`p-4 text-right font-bold ${tx.type === 'CREDIT' ? 'text-green-400' : 'text-red-400'}`}>
                         {tx.type === 'CREDIT' ? '+' : ''}
                         {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(tx.amount)}
                      </td>
                      <td className="p-4 text-center">
                         <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">Concluído</span>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  </div>
);

const VerificationCenter: React.FC<{ docs: VerificationDocument[], status: string }> = ({ docs, status }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex justify-between items-center">
       <h2 className="text-2xl font-bold text-white">Centro de Verificação</h2>
       <div className={`px-4 py-2 rounded-full border text-sm font-bold ${
          status === 'VERIFIED' ? 'bg-green-500/10 border-green-500 text-green-400' : 
          status === 'PENDING' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' : 
          'bg-red-500/10 border-red-500 text-red-400'
       }`}>
          {status === 'VERIFIED' ? 'Conta Verificada' : status === 'PENDING' ? 'Em Análise' : 'Documentação Pendente'}
       </div>
    </div>

    <div className="bg-unikiala-surface border border-white/5 p-6 rounded-3xl">
       <p className="text-gray-400 mb-6">
          Para garantir a segurança da plataforma e liberar saques acima de 1 milhão de Kz, precisamos validar a identidade da sua empresa.
       </p>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border-2 border-dashed border-gray-700 hover:border-unikiala-pink rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-black/20">
             <FileText className="w-10 h-10 text-gray-500 mb-4" />
             <p className="text-white font-bold">Contrato Social / NIF</p>
             <p className="text-xs text-gray-500 mt-1">PDF ou JPG (Max 5MB)</p>
          </div>
          <div className="border-2 border-dashed border-gray-700 hover:border-unikiala-pink rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-black/20">
             <Upload className="w-10 h-10 text-gray-500 mb-4" />
             <p className="text-white font-bold">Identidade do Sócio</p>
             <p className="text-xs text-gray-500 mt-1">Frente e Verso</p>
          </div>
       </div>

       <h3 className="font-bold text-white mb-4">Documentos Enviados</h3>
       <div className="space-y-3">
          {docs.map(doc => (
             <div key={doc.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center">
                   <FileText className="w-5 h-5 text-unikiala-pink mr-3" />
                   <div>
                      <p className="text-white font-medium">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.uploadDate}</p>
                   </div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                   doc.status === 'APPROVED' ? 'text-green-400 bg-green-500/10' : 'text-yellow-400 bg-yellow-500/10'
                }`}>
                   {doc.status === 'APPROVED' ? 'Aprovado' : 'Analisando'}
                </span>
             </div>
          ))}
       </div>
    </div>
  </div>
);

const CompanyProfile: React.FC<{ organizer: OrganizerProfile }> = ({ organizer }) => (
  <div className="max-w-3xl animate-in fade-in duration-500">
     <h2 className="text-2xl font-bold text-white mb-6">Dados da Empresa</h2>
     <form className="space-y-6">
        <div className="flex items-center gap-6 mb-8">
           <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
              <ImageIcon className="w-8 h-8 text-gray-500" />
           </div>
           <div>
              <button type="button" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-bold mb-2">Alterar Logo</button>
              <p className="text-xs text-gray-500">Recomendado: 500x500px (PNG)</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nome Fantasia / Artístico</label>
              <input type="text" defaultValue={organizer.name} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
           </div>
           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">NIF</label>
              <input type="text" defaultValue={organizer.nif} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
           </div>
        </div>

        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Bio / Descrição</label>
           <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" defaultValue="Produtora focada em eventos de Jazz e cultura angolana..."></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Categoria Principal</label>
              <select className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white">
                 <option>Música</option>
                 <option>Teatro</option>
                 <option>Workshop</option>
              </select>
           </div>
           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Website / Redes</label>
              <input type="text" placeholder="instagram.com/..." className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
           </div>
        </div>

        <div className="pt-6 border-t border-white/10">
           <button className="bg-unikiala-pink text-black font-bold px-8 py-3 rounded-xl hover:bg-white transition-colors">
              Salvar Alterações
           </button>
        </div>
     </form>
  </div>
);

const CheckInTool: React.FC = () => (
   <div className="max-w-md mx-auto text-center pt-10 animate-in fade-in duration-500">
      <div className="bg-unikiala-surface border border-white/10 p-8 rounded-3xl shadow-2xl">
         <div className="w-16 h-16 bg-unikiala-pink/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <QrCode className="w-8 h-8 text-unikiala-pink" />
         </div>
         <h2 className="text-2xl font-bold text-white mb-2">Validador de Ingressos</h2>
         <p className="text-gray-400 mb-8 text-sm">Use a câmera ou digite o código para validar a entrada.</p>
         
         <div className="aspect-square bg-black rounded-2xl mb-6 relative overflow-hidden border border-white/20 flex items-center justify-center">
            <p className="text-gray-500 text-xs">Câmera Inativa (Demo)</p>
            <div className="absolute inset-0 border-2 border-unikiala-pink/50 animate-pulse m-8 rounded-lg"></div>
         </div>

         <div className="flex gap-2">
            <input type="text" placeholder="Código do ingresso (ex: #TIX-123)" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-unikiala-pink" />
            <button className="bg-white text-black font-bold px-4 py-3 rounded-xl hover:bg-gray-200">
               Validar
            </button>
         </div>
      </div>
   </div>
);

const AnalyticsView: React.FC<{ data: any[] }> = ({ data }) => (
   <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-white">Analytics & Desempenho</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-unikiala-surface p-6 rounded-3xl border border-white/5">
            <h3 className="text-white font-bold mb-6">Vendas por Dia</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }} />
                  <Bar dataKey="vendas" fill="#FF00FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-unikiala-surface p-6 rounded-3xl border border-white/5">
            <h3 className="text-white font-bold mb-6">Origem do Tráfego</h3>
            <div className="space-y-4">
               <TrafficBar label="App Mobile" percent={65} color="bg-unikiala-pink" />
               <TrafficBar label="Website Desktop" percent={25} color="bg-purple-500" />
               <TrafficBar label="Links Diretos (WhatsApp)" percent={10} color="bg-green-500" />
            </div>
         </div>
      </div>
   </div>
);

const TrafficBar: React.FC<{ label: string, percent: number, color: string }> = ({ label, percent, color }) => (
   <div>
      <div className="flex justify-between text-sm mb-1">
         <span className="text-gray-300">{label}</span>
         <span className="text-white font-bold">{percent}%</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
         <div className={`h-full ${color}`} style={{ width: `${percent}%` }}></div>
      </div>
   </div>
);

// Reusing existing Create Event Logic but wrapped in a new layout
const EventsManager: React.FC<{ onAddEvent: (event: Omit<Event, 'id'>) => Promise<boolean>, isSubscribed: boolean }> = ({ onAddEvent, isSubscribed }) => {
   const [view, setView] = useState<'LIST' | 'CREATE'>('LIST');

   // Mock Events List
   const events = [
      { id: '1', title: 'Festival de Jazz', date: '2025-04-15', status: 'ACTIVE', sold: 450, revenue: 6750000 },
      { id: '2', title: 'Workshop Arte', date: '2025-05-20', status: 'DRAFT', sold: 0, revenue: 0 },
   ];

   if (view === 'CREATE') {
      return (
         <div className="animate-in fade-in duration-300">
            <button onClick={() => setView('LIST')} className="mb-6 flex items-center text-gray-400 hover:text-white">
               <ChevronRight className="w-4 h-4 mr-1 rotate-180" /> Voltar para Lista
            </button>
            <CreateEventForm onAddEvent={onAddEvent} isSubscribed={isSubscribed} onCancel={() => setView('LIST')} />
         </div>
      );
   }

   return (
      <div className="space-y-6 animate-in fade-in duration-300">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Meus Eventos</h2>
            <button 
               onClick={() => setView('CREATE')}
               className="bg-unikiala-pink text-black font-bold px-4 py-2 rounded-xl hover:bg-white transition-colors flex items-center shadow-neon"
            >
               <Plus className="w-4 h-4 mr-2" /> Novo Evento
            </button>
         </div>

         <div className="flex gap-4 border-b border-white/10 pb-4 overflow-x-auto">
            <button className="text-white font-bold border-b-2 border-unikiala-pink pb-4 -mb-4.5">Todos (2)</button>
            <button className="text-gray-400 hover:text-white pb-4">Ativos (1)</button>
            <button className="text-gray-400 hover:text-white pb-4">Rascunhos (1)</button>
            <button className="text-gray-400 hover:text-white pb-4">Encerrados (0)</button>
         </div>

         <div className="space-y-4">
            {events.map(evt => (
               <div key={evt.id} className="bg-unikiala-surface border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden">
                        <img src={`https://picsum.photos/200?random=${evt.id}`} className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <h3 className="font-bold text-white">{evt.title}</h3>
                        <p className="text-sm text-gray-400">{evt.date}</p>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                     <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase">Vendidos</p>
                        <p className="text-white font-bold">{evt.sold}</p>
                     </div>
                     <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase">Receita</p>
                        <p className="text-green-400 font-bold">{new Intl.NumberFormat('pt-AO', { compactDisplay: "short", notation: "compact" }).format(evt.revenue)}</p>
                     </div>
                     <div className={`px-3 py-1 rounded-full text-xs font-bold ${evt.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-300'}`}>
                        {evt.status === 'ACTIVE' ? 'Ativo' : 'Rascunho'}
                     </div>
                     <button className="p-2 hover:bg-white/10 rounded-lg"><Settings className="w-4 h-4 text-gray-400" /></button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

// Extracted Form Component
const CreateEventForm: React.FC<{ onAddEvent: (e: any) => Promise<boolean>, isSubscribed: boolean, onCancel: () => void }> = ({ onAddEvent, isSubscribed, onCancel }) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await onAddEvent({
            title, description, date, location, price: Number(price), imageUrl,
            organizerId: 'current', organizerWhatsapp: whatsapp, highlighted: isSubscribed
        });
        setIsSubmitting(false);
        if (success) onCancel();
    };
  
    return (
        <div className="bg-unikiala-surface p-6 md:p-8 rounded-3xl border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-6">Criar Nova Atividade</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Imagem</label>
                        <div onClick={() => fileInputRef.current?.click()} className="h-48 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden relative group">
                            <img src={imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                            <div className="relative z-10 bg-black/50 p-2 rounded-full"><Upload className="w-6 h-6 text-white" /></div>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden />
                    </div>
                    <div className="space-y-4">
                        <input required placeholder="Título do Evento" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white" />
                        <div className="grid grid-cols-2 gap-4">
                           <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white" />
                           <input required type="number" placeholder="Preço" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white" />
                        </div>
                        <input required placeholder="Localização" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white" />
                        <input required placeholder="WhatsApp" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white" />
                    </div>
                </div>
                
                {/* AI Assistant */}
                <div className="bg-unikiala-pink/5 border border-unikiala-pink/20 p-4 rounded-xl">
                   <div className="flex gap-2 mb-2">
                      <input placeholder="Detalhes para IA (ex: Jazz, Vinho...)" value={details} onChange={e => setDetails(e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 text-sm text-white" />
                      <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="bg-white/10 text-unikiala-pink px-3 rounded-lg text-xs font-bold flex items-center">
                         {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />} Gerar
                      </button>
                   </div>
                   <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white h-24" placeholder="Descrição..." />
                </div>

                <div className="flex gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5">Cancelar</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-unikiala-pink text-black font-bold hover:bg-white transition-colors shadow-neon">
                       {isSubmitting ? 'Publicando...' : 'Publicar Evento'}
                    </button>
                </div>
            </form>
        </div>
    );
}
