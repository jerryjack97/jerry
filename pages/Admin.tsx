import React, { useEffect, useState } from 'react';
import { Event, OrganizerProfile } from '../types';
import { BarChart, DollarSign, Users, Activity, Database, Wifi, WifiOff, Trash2 } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { checkConnection, isSupabaseConfigured } from '../services/supabaseClient';

interface AdminProps {
  events: Event[];
  organizers: OrganizerProfile[];
  onDeleteEvent?: (id: string) => void;
}

export const Admin: React.FC<AdminProps> = ({ events, organizers, onDeleteEvent }) => {
  
  const totalRevenue = organizers.filter(o => o.isSubscribed).length * 500000; 
  const activeEvents = events.length;
  const totalOrganizers = organizers.length;

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

  const chartData = [
    { name: 'Jan', events: 4 },
    { name: 'Fev', events: 7 },
    { name: 'Mar', events: 5 },
    { name: 'Abr', events: 10 },
    { name: 'Mai', events: 12 },
    { name: 'Jun', events: events.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">Dashboard Administrativo</h1>
          <p className="text-gray-400 text-sm mt-1">Visão geral do sistema e métricas de performance.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Indicador de Status do Banco de Dados */}
          <div className={`flex items-center space-x-2 text-sm px-4 py-2 rounded-full border transition-colors ${
            dbStatus === 'connected' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
            dbStatus === 'local' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
            dbStatus === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
            'bg-gray-800 border-gray-700 text-gray-400'
          }`}>
             {dbStatus === 'connected' && <Wifi className="w-4 h-4" />}
             {dbStatus === 'local' && <Database className="w-4 h-4" />}
             {(dbStatus === 'error' || dbStatus === 'checking') && <WifiOff className="w-4 h-4" />}
             
             <span className="font-bold">
               {dbStatus === 'connected' && "Base de Dados: Online"}
               {dbStatus === 'local' && "Modo Local (Híbrido)"}
               {dbStatus === 'error' && "Erro de Conexão"}
               {dbStatus === 'checking' && "Verificando..."}
             </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        <StatCard 
          icon={<DollarSign className="text-black w-6 h-6" />} 
          label="Receita de Planos" 
          value={new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(totalRevenue)}
          color="bg-unikiala-pink"
        />
        <StatCard 
          icon={<Users className="text-black w-6 h-6" />} 
          label="Organizadores" 
          value={totalOrganizers.toString()}
          color="bg-purple-500"
        />
        <StatCard 
          icon={<Activity className="text-black w-6 h-6" />} 
          label="Eventos Ativos" 
          value={activeEvents.toString()}
          color="bg-cyan-400"
        />
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="bg-unikiala-surface p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-8 flex items-center">
            <BarChart className="mr-2 text-gray-400 w-5 h-5" /> Crescimento de Eventos
          </h2>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={chartData}>
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF00FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF00FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} />
                <YAxis stroke="#666" axisLine={false} tickLine={false} />
                <Tooltip 
                    cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                    contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff', borderRadius: '8px' }} 
                    itemStyle={{ color: '#ff00ff' }}
                />
                <Bar dataKey="events" fill="url(#colorEvents)" radius={[4, 4, 0, 0]} barSize={40} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-unikiala-surface p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-xl font-bold text-white">Gerenciar Atividades</h2>
          </div>
          
          {/* Scroll Wrapper for Table on Mobile */}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
             <div className="inline-block min-w-full align-middle overflow-hidden rounded-xl border border-white/5">
               <table className="min-w-full text-left text-sm text-gray-400">
                 <thead className="bg-black/50 text-gray-200 font-display">
                   <tr>
                     <th className="py-4 px-6 font-semibold whitespace-nowrap">Evento</th>
                     <th className="py-4 px-6 font-semibold whitespace-nowrap">Data</th>
                     <th className="py-4 px-6 font-semibold text-right whitespace-nowrap">Preço</th>
                     <th className="py-4 px-6 font-semibold text-center whitespace-nowrap">Ações</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {events.map((event) => (
                     <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                       <td className="py-4 px-6 font-medium text-white whitespace-nowrap">{event.title}</td>
                       <td className="py-4 px-6 whitespace-nowrap">{new Date(event.date).toLocaleDateString('pt-AO')}</td>
                       <td className="py-4 px-6 text-right font-mono text-unikiala-pink whitespace-nowrap">
                         {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(event.price)}
                       </td>
                       <td className="py-4 px-6 text-center whitespace-nowrap">
                          <button 
                            onClick={() => onDeleteEvent && onDeleteEvent(event.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                            title="Apagar Evento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {events.length === 0 && (
                 <div className="text-center py-8 text-gray-500">Nenhum evento encontrado.</div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-unikiala-surface p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-colors relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:opacity-10 transition-opacity`}></div>
    <div className="flex items-center mb-4">
      <div className={`p-3 ${color} rounded-xl shadow-lg`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl md:text-3xl font-display font-bold text-white">{value}</p>
    </div>
  </div>
);