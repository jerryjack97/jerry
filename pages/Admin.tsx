
import React, { useState, useEffect } from 'react';
import { Event, OrganizerProfile } from '../types';
import { 
  LayoutDashboard, Users, ShieldAlert, DollarSign, FileText, 
  Ban, CheckCircle, XCircle, Search, MoreVertical, AlertTriangle, 
  Database, Wifi, WifiOff, Trash2, CreditCard, ListTodo, Server, Lock
} from 'lucide-react';
import { checkConnection, isSupabaseConfigured } from '../services/supabaseClient';

interface AdminProps {
  events: Event[];
  organizers: OrganizerProfile[];
  onDeleteEvent?: (id: string) => void;
}

type Section = 'DASHBOARD' | 'ORGANIZERS' | 'EVENTS' | 'FINANCE' | 'USERS';

export const Admin: React.FC<AdminProps> = ({ events, organizers, onDeleteEvent }) => {
  const [activeSection, setActiveSection] = useState<Section>('DASHBOARD');
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'local' | 'error'>('checking');

  useEffect(() => {
    const verifyDb = async () => {
      if (!isSupabaseConfigured) {
        setDbStatus('local');
        return;
      }
      const connected = await checkConnection();
      setDbStatus(connected ? 'connected' : 'error');
    };
    verifyDb();
  }, []);

  const renderContent = () => {
     switch (activeSection) {
        case 'DASHBOARD': return <GlobalDashboard events={events} organizers={organizers} dbStatus={dbStatus} />;
        case 'ORGANIZERS': return <OrganizerManagement organizers={organizers} />;
        case 'EVENTS': return <EventModeration events={events} onDeleteEvent={onDeleteEvent} />;
        case 'FINANCE': return <GlobalFinance />;
        default: return <GlobalDashboard events={events} organizers={organizers} dbStatus={dbStatus} />;
     }
  };

  return (
    <div className="flex min-h-screen bg-unikiala-black">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-unikiala-surface border-r border-white/5 fixed h-full hidden lg:block">
         <div className="p-6 border-b border-white/5">
            <h1 className="text-xl font-display font-bold text-white tracking-wider">ADMIN <span className="text-unikiala-pink">PANEL</span></h1>
            <div className={`mt-2 flex items-center text-xs font-bold px-2 py-1 rounded w-fit ${
               dbStatus === 'connected' ? 'bg-green-500/10 text-green-400' : 
               dbStatus === 'local' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
            }`}>
               {dbStatus === 'connected' ? 'Online' : dbStatus === 'local' ? 'Local Mode' : 'Offline'}
            </div>
         </div>
         <nav className="p-4 space-y-1">
            <AdminNavButton active={activeSection === 'DASHBOARD'} onClick={() => setActiveSection('DASHBOARD')} icon={<LayoutDashboard />} label="Dashboard Global" />
            <AdminNavButton active={activeSection === 'ORGANIZERS'} onClick={() => setActiveSection('ORGANIZERS')} icon={<Users />} label="Gestão Organizadores" />
            <AdminNavButton active={activeSection === 'EVENTS'} onClick={() => setActiveSection('EVENTS')} icon={<FileText />} label="Moderação Eventos" />
            <AdminNavButton active={activeSection === 'FINANCE'} onClick={() => setActiveSection('FINANCE')} icon={<DollarSign />} label="Financeiro Global" />
            <AdminNavButton active={activeSection === 'USERS'} onClick={() => setActiveSection('USERS')} icon={<ShieldAlert />} label="Usuários & Risco" />
         </nav>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 lg:ml-64 p-6 md:p-10 overflow-y-auto">
         {renderContent()}
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const AdminNavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
   <button
     onClick={onClick}
     className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
       active 
         ? 'bg-unikiala-pink text-black font-bold' 
         : 'text-gray-400 hover:bg-white/5 hover:text-white'
     }`}
   >
     <span className="mr-3 w-5 h-5">{icon}</span>
     {label}
   </button>
 );

const GlobalDashboard: React.FC<{ events: Event[], organizers: OrganizerProfile[], dbStatus: string }> = ({ events, organizers, dbStatus }) => (
   <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-white">Visão Geral da Plataforma</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <KPIBox label="GMV Total (Vol. Transacionado)" value="245.8M Kz" change="+12%" />
         <KPIBox label="Receita Líquida (Taxas)" value="24.5M Kz" change="+15%" />
         <KPIBox label="Usuários Ativos" value="12,450" change="+8%" />
         <KPIBox label="Eventos Publicados" value={events.length.toString()} change="+3" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* Roadmap Widget - LISTA DO QUE FALTA */}
         <div className="bg-unikiala-surface border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-unikiala-pink/20 rounded-lg">
                  <ListTodo className="w-5 h-5 text-unikiala-pink" />
               </div>
               <h3 className="text-white font-bold">Roadmap do Sistema (O que falta?)</h3>
            </div>

            <div className="space-y-4">
               <RoadmapItem 
                  status="pending" 
                  title="Gateway de Pagamento Real" 
                  desc="Integração com ProxyPay ou Multicaixa Express para substituir WhatsApp."
               />
               <RoadmapItem 
                  status={dbStatus === 'connected' ? 'done' : 'warning'} 
                  title="Banco de Dados Real" 
                  desc={dbStatus === 'connected' ? "Supabase Conectado" : "Usando Modo Local. Necessário conectar Supabase."}
               />
               <RoadmapItem 
                  status="pending" 
                  title="Storage de Arquivos (Imagens)" 
                  desc="Configurar Buckets para salvar fotos reais em vez de Base64 (lento)."
               />
               <RoadmapItem 
                  status="done" 
                  title="Validação de Ingressos (QR)" 
                  desc="Ferramenta de simulação de validação por câmera implementada no painel do organizador."
               />
               <RoadmapItem 
                  status="pending" 
                  title="Emails Transacionais" 
                  desc="Configurar SMTP (Resend/SendGrid) para emails de compra."
               />
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-unikiala-surface border border-white/5 rounded-2xl p-6">
               <h3 className="text-white font-bold mb-6">Organizadores Pendentes</h3>
               <div className="space-y-4">
                  {[1, 2].map(i => (
                     <div key={i} className="flex items-center justify-between bg-black/20 p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                           <div>
                              <p className="text-white font-bold">Nova Produtora {i}</p>
                              <p className="text-xs text-gray-400">CNPJ/NIF Enviado</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button className="p-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"><CheckCircle className="w-4 h-4" /></button>
                           <button className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"><XCircle className="w-4 h-4" /></button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-unikiala-surface border border-white/5 rounded-2xl p-6">
               <h3 className="text-white font-bold mb-6">Log de Atividades</h3>
               <div className="space-y-4 text-sm">
                  <LogItem action="Novo Cadastro" detail="Usuário João Silva" time="2 min atrás" />
                  <LogItem action="Venda Confirmada" detail="3x Ingressos - Jazz Fest" time="5 min atrás" />
               </div>
            </div>
         </div>
      </div>
   </div>
);

const RoadmapItem: React.FC<{ status: 'done' | 'pending' | 'warning', title: string, desc: string }> = ({ status, title, desc }) => (
   <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-white/5 transition-colors">
      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
         status === 'done' ? 'bg-green-500' : 
         status === 'warning' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-600'
      }`} />
      <div>
         <h4 className={`font-bold text-sm ${status === 'done' ? 'text-gray-500 line-through' : 'text-white'}`}>{title}</h4>
         <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
      </div>
      {status === 'pending' && <span className="ml-auto text-[10px] font-bold bg-white/10 px-2 py-1 rounded text-gray-400">TODO</span>}
   </div>
);

const OrganizerManagement: React.FC<{ organizers: OrganizerProfile[] }> = ({ organizers }) => (
   <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-white">Gestão de Organizadores</h2>
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Buscar por NIF ou Nome" className="bg-unikiala-surface border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm w-64" />
         </div>
      </div>

      <div className="bg-unikiala-surface border border-white/5 rounded-2xl overflow-hidden">
         <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-gray-400 font-display uppercase">
               <tr>
                  <th className="p-4">Nome / Empresa</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Saldo Retido</th>
                  <th className="p-4">Documentos</th>
                  <th className="p-4 text-right">Ações</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {organizers.map((org, idx) => (
                  <tr key={idx} className="hover:bg-white/5">
                     <td className="p-4">
                        <p className="text-white font-bold">{org.name}</p>
                        <p className="text-xs text-gray-500">{org.email || 'sem email'}</p>
                     </td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${org.isSubscribed ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                           {org.isSubscribed ? 'Assinante' : 'Grátis'}
                        </span>
                     </td>
                     <td className="p-4 text-white">1.2M Kz</td>
                     <td className="p-4">
                        <span className="text-yellow-400 text-xs flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Pendente</span>
                     </td>
                     <td className="p-4 text-right flex justify-end gap-2">
                        <button className="text-gray-400 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   </div>
);

const EventModeration: React.FC<{ events: Event[], onDeleteEvent?: (id: string) => void }> = ({ events, onDeleteEvent }) => (
   <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-white">Moderação de Eventos</h2>
      
      <div className="bg-unikiala-surface border border-white/5 rounded-2xl overflow-hidden">
         <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-gray-400 font-display uppercase">
               <tr>
                  <th className="p-4">Evento</th>
                  <th className="p-4">Organizador</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ações</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {events.map(evt => (
                  <tr key={evt.id} className="hover:bg-white/5">
                     <td className="p-4 font-medium text-white">{evt.title}</td>
                     <td className="p-4 text-gray-400">ID: {evt.organizerId}</td>
                     <td className="p-4 text-gray-400">{new Date(evt.date).toLocaleDateString()}</td>
                     <td className="p-4"><span className="text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded">Publicado</span></td>
                     <td className="p-4 text-right">
                        <button onClick={() => onDeleteEvent && onDeleteEvent(evt.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded" title="Apagar Evento"><Trash2 className="w-4 h-4" /></button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   </div>
);

const GlobalFinance: React.FC = () => (
   <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-white">Controle Financeiro Global</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-2xl">
            <h3 className="text-green-400 text-sm uppercase font-bold mb-2">Saldo em Custódia</h3>
            <p className="text-3xl text-white font-display font-bold">125.4M Kz</p>
         </div>
         <div className="bg-unikiala-surface border border-white/10 p-6 rounded-2xl">
            <h3 className="text-gray-400 text-sm uppercase font-bold mb-2">Repasses Pendentes</h3>
            <p className="text-3xl text-white font-display font-bold">45.2M Kz</p>
         </div>
         <div className="bg-unikiala-surface border border-white/10 p-6 rounded-2xl">
            <h3 className="text-gray-400 text-sm uppercase font-bold mb-2">Taxas Coletadas (Mês)</h3>
            <p className="text-3xl text-unikiala-pink font-display font-bold">2.8M Kz</p>
         </div>
      </div>
   </div>
);

const KPIBox: React.FC<{ label: string, value: string, change: string }> = ({ label, value, change }) => (
   <div className="bg-unikiala-surface border border-white/5 p-6 rounded-2xl">
      <p className="text-gray-400 text-xs font-bold uppercase mb-2">{label}</p>
      <div className="flex items-end justify-between">
         <h3 className="text-2xl font-bold text-white">{value}</h3>
         <span className="text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">{change}</span>
      </div>
   </div>
);

const LogItem: React.FC<{ action: string, detail: string, time: string, type?: 'alert' | 'normal' }> = ({ action, detail, time, type }) => (
   <div className="flex justify-between items-center border-b border-white/5 last:border-0 pb-2 last:pb-0">
      <div>
         <p className={`font-bold ${type === 'alert' ? 'text-red-400' : 'text-white'}`}>{action}</p>
         <p className="text-gray-500 text-xs">{detail}</p>
      </div>
      <span className="text-gray-600 text-xs">{time}</span>
   </div>
);
