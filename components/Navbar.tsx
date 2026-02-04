
import React, { useRef, useState, useEffect } from 'react';
import { UserRole, User, Notification } from '../types';
import { Ticket, Users, LayoutDashboard, Menu, ChevronLeft, ChevronRight, LogOut, User as UserIcon, X, Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react';

// New Logo Component based on the provided image
const UnikialaLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex items-center gap-2 md:gap-3 ${className} group cursor-pointer select-none`}>
    <div className="relative w-14 md:w-20 h-14 md:h-20 flex items-center justify-center shrink-0">
      {/* The Tribal Roof and Muringue (SVG recreate) */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-unikiala-pink group-hover:drop-shadow-neon transition-all duration-300">
        {/* Slanted Tribal Roof with pattern markers */}
        <path 
          d="M10 65 L50 25 L90 65" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeDasharray="1, 5"
        />
        {/* Outer roof lines */}
        <path d="M15 68 L50 33 L85 68" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        
        {/* The Muringue (Clay Pot) */}
        <path 
          d="M44 55 C44 55 36 60 36 72 C36 82 42 88 50 88 C58 88 64 82 64 72 C64 60 56 55 56 55 L56 48 L44 48 Z" 
          fill="currentColor" 
        />
        {/* Tribal bands on the pot */}
        <rect x="42" y="70" width="16" height="1.5" fill="black" opacity="0.4" />
        <rect x="42" y="74" width="16" height="1.5" fill="black" opacity="0.4" />
      </svg>
    </div>
    
    <div className="flex flex-col justify-center">
      <div className="flex items-center">
        <span className="text-2xl md:text-5xl font-display font-bold text-white tracking-tighter group-hover:text-unikiala-pink transition-colors duration-300 flex items-baseline">
          UN
          <span className="relative inline-block mx-0.5">
            I
            <span className="absolute -top-1 md:-top-2 left-1/2 -translate-x-1/2 w-4 md:w-6 h-2 md:h-3 bg-unikiala-pink rounded-t-full shadow-neon"></span>
          </span>
          K
          <span className="relative inline-block mx-0.5">
            I
            <span className="absolute -top-1 md:-top-2 left-1/2 -translate-x-1/2 w-4 md:w-6 h-2 md:h-3 bg-unikiala-pink rounded-t-full shadow-neon"></span>
          </span>
          ALA
        </span>
      </div>
    </div>
  </div>
);

interface NavbarProps {
  currentUser: User | null;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentUser,
  currentRole, 
  setRole, 
  canGoBack, 
  canGoForward, 
  onBack, 
  onForward,
  onLogout
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Notification State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const [notifications, setNotifications] = useState<Notification[]>([
      { id: '1', userId: 'u1', title: 'Pagamento Confirmado', message: 'Seu ingresso para o Festival de Jazz foi emitido com sucesso.', type: 'SUCCESS', read: false, createdAt: 'Há 5 min' },
      { id: '2', userId: 'u1', title: 'Nova Resposta', message: 'O organizador respondeu sua dúvida sobre o Workshop de Arte.', type: 'INFO', read: false, createdAt: 'Há 1 hora' },
      { id: '3', userId: 'u1', title: 'Evento Próximo', message: 'Faltam 2 dias para a Exposição de Arte. Prepare-se!', type: 'WARNING', read: true, createdAt: 'Ontem' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determinar permissões de visualização
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isOrganizer = currentUser?.role === UserRole.ORGANIZER;
  
  const canAccessOrganizer = isAdmin || isOrganizer;
  const canAccessAdmin = isAdmin;

  // --- Lógica de Som (Web Audio API) ---
  const playFireworkSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const t = ctx.currentTime;

      // 1. O "Assobio" (subida)
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200, t);
      oscillator.frequency.exponentialRampToValueAtTime(800, t + 0.5);
      
      gainNode.gain.setValueAtTime(0.1, t);
      gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
      
      oscillator.start(t);
      oscillator.stop(t + 0.5);

      // 2. A "Explosão" (Ruído)
      const bufferSize = ctx.sampleRate * 2; // 2 segundos
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const noiseGain = ctx.createGain();
      const noiseFilter = ctx.createBiquadFilter();
      
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(1000, t + 0.5);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      
      noiseGain.gain.setValueAtTime(0, t + 0.4);
      noiseGain.gain.linearRampToValueAtTime(0.8, t + 0.5); // Explosão alta
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 1.5); // Decay
      
      noise.start(t + 0.4);
      noise.stop(t + 1.5);

    } catch (e) {
      console.error("Audio error", e);
    }
  };

  // --- Lógica de Animação (Canvas) ---
  const triggerFireworks = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar tamanho
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: Particle[] = [];
    const colors = ['#FF00FF', '#FFFFFF', '#B300B3', '#FF66FF', '#800080'];
    
    // Criar partículas no centro
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: centerX,
        y: centerY,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 3 + 1
      });
    }

    const animate = () => {
      if (!ctx) return;
      // Rastro suave
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let activeParticles = false;

      particles.forEach(p => {
        if (p.alpha > 0) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2; // Gravidade
          p.alpha -= 0.02; // Fade out

          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          
          activeParticles = true;
        }
      });

      if (activeParticles) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 0; // Reset para não bloquear cliques
        canvas.height = 0;
      }
    };

    animate();
  };

  const handleLogoClick = () => {
    setRole(UserRole.USER);
    playFireworkSound();
    triggerFireworks();
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (role: UserRole) => {
    setRole(role);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-[100]"
      />
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-28">
            <div className="flex items-center gap-4 md:gap-8">
               {/* Updated Tribal Logo */}
              <div 
                onClick={handleLogoClick}
                className="flex items-center"
              >
                <UnikialaLogo />
              </div>

              {/* Navigation Controls - Desktop */}
              <div className="hidden lg:flex items-center space-x-2 ml-4">
                <button 
                  onClick={onBack} 
                  disabled={!canGoBack}
                  className={`p-2 rounded-full transition-all ${canGoBack ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={onForward} 
                  disabled={!canGoForward}
                  className={`p-2 rounded-full transition-all ${canGoForward ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-1 bg-white/5 p-1 rounded-full border border-white/10">
              <NavButton 
                active={currentRole === UserRole.USER} 
                onClick={() => handleNavClick(UserRole.USER)} 
                icon={<Ticket className="w-4 h-4" />}
                label="Eventos"
              />
              
              {/* Botão explícito de Perfil no menu central */}
              {currentUser && (
                <NavButton 
                  active={currentRole === UserRole.PROFILE} 
                  onClick={() => handleNavClick(UserRole.PROFILE)} 
                  icon={<UserIcon className="w-4 h-4" />}
                  label="Meu Perfil"
                />
              )}
              
              {canAccessOrganizer && (
                <NavButton 
                  active={currentRole === UserRole.ORGANIZER} 
                  onClick={() => handleNavClick(UserRole.ORGANIZER)} 
                  icon={<Users className="w-4 h-4" />}
                  label="Organizador"
                />
              )}
              
              {canAccessAdmin && (
                <NavButton 
                  active={currentRole === UserRole.ADMIN} 
                  onClick={() => handleNavClick(UserRole.ADMIN)} 
                  icon={<LayoutDashboard className="w-4 h-4" />}
                  label="Admin"
                />
              )}
            </div>

            {/* User Profile, Notifications & Logout - Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              
              {/* Notification Center */}
              {currentUser && (
                <div className="relative" ref={notificationRef}>
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors relative"
                    title="Notificações"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-unikiala-pink rounded-full shadow-neon animate-pulse border border-black"></span>
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-unikiala-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 z-50">
                       <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
                          <h4 className="font-bold text-white text-sm">Notificações</h4>
                          {unreadCount > 0 && (
                             <button onClick={markAllRead} className="text-[10px] text-unikiala-pink font-bold hover:underline">
                                Marcar como lidas
                             </button>
                          )}
                       </div>
                       <div className="max-h-80 overflow-y-auto custom-scrollbar">
                          {notifications.length === 0 ? (
                             <div className="p-8 text-center text-gray-500">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-xs">Nenhuma notificação</p>
                             </div>
                          ) : (
                             notifications.map(note => (
                                <div key={note.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!note.read ? 'bg-unikiala-pink/5' : ''}`}>
                                   <div className="flex gap-3">
                                      <div className={`mt-1 shrink-0 ${
                                         note.type === 'SUCCESS' ? 'text-green-400' :
                                         note.type === 'WARNING' ? 'text-yellow-400' : 'text-blue-400'
                                      }`}>
                                         {note.type === 'SUCCESS' ? <CheckCircle className="w-4 h-4" /> :
                                          note.type === 'WARNING' ? <AlertTriangle className="w-4 h-4" /> :
                                          <Info className="w-4 h-4" />}
                                      </div>
                                      <div>
                                         <p className="text-sm font-bold text-white leading-tight mb-1">{note.title}</p>
                                         <p className="text-xs text-gray-400 leading-relaxed">{note.message}</p>
                                         <p className="text-[10px] text-gray-500 mt-2">{note.createdAt}</p>
                                      </div>
                                   </div>
                                </div>
                             ))
                          )}
                       </div>
                    </div>
                  )}
                </div>
              )}

              {currentUser && (
                <button 
                  onClick={() => handleNavClick(UserRole.PROFILE)}
                  className="flex items-center text-right group focus:outline-none"
                  title="Meu Perfil"
                >
                  <div className="mr-3">
                    <p className="text-sm font-bold text-white leading-none group-hover:text-unikiala-pink transition-colors">{currentUser.name}</p>
                    <p className="text-xs text-gray-400 leading-none mt-1">{currentUser.role}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shadow-neon ${currentRole === UserRole.PROFILE ? 'border-unikiala-pink bg-unikiala-pink/20' : 'border-white/20 bg-white/5 group-hover:border-unikiala-pink'}`}>
                    {currentUser.avatarUrl ? (
                       <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                       <span className="font-display font-bold text-white">
                         {currentUser.name.charAt(0).toUpperCase()}
                       </span>
                    )}
                  </div>
                </button>
              )}
              
              <button 
                onClick={onLogout}
                className="p-2 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-gray-400 transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center gap-2">
               {/* Simple back button for mobile if needed history */}
               {(canGoBack) && (
                  <button onClick={onBack} className="p-2 text-gray-400 hover:text-white">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
               )}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2 bg-white/10 rounded-lg"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl animate-in slide-in-from-top-5 z-40">
            <div className="px-4 py-6 space-y-4">
              {currentUser && (
                <button 
                  onClick={() => handleNavClick(UserRole.PROFILE)}
                  className={`flex items-center w-full mb-6 p-4 rounded-xl transition-colors border ${currentRole === UserRole.PROFILE ? 'bg-unikiala-pink/10 border-unikiala-pink' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                >
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-3 border border-white/20 overflow-hidden">
                    {currentUser.avatarUrl ? (
                       <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                       <span className="font-display font-bold text-lg text-white">{currentUser.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold">{currentUser.name}</p>
                    <p className="text-xs text-unikiala-pink font-bold uppercase">Ver Meu Perfil</p>
                  </div>
                </button>
              )}

              <MobileNavButton 
                active={currentRole === UserRole.USER} 
                onClick={() => handleNavClick(UserRole.USER)} 
                icon={<Ticket className="w-5 h-5" />}
                label="Eventos & Ingressos"
              />

              <MobileNavButton 
                active={currentRole === UserRole.PROFILE} 
                onClick={() => handleNavClick(UserRole.PROFILE)} 
                icon={<UserIcon className="w-5 h-5" />}
                label="Meu Perfil"
              />

              {canAccessOrganizer && (
                <MobileNavButton 
                  active={currentRole === UserRole.ORGANIZER} 
                  onClick={() => handleNavClick(UserRole.ORGANIZER)} 
                  icon={<Users className="w-5 h-5" />}
                  label="Área do Organizador"
                />
              )}

              {canAccessAdmin && (
                <MobileNavButton 
                  active={currentRole === UserRole.ADMIN} 
                  onClick={() => handleNavClick(UserRole.ADMIN)} 
                  icon={<LayoutDashboard className="w-5 h-5" />}
                  label="Administração"
                />
              )}

              <div className="pt-4 border-t border-white/10">
                <button 
                  onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-bold"
                >
                  <LogOut className="w-5 h-5 mr-3" /> Sair da Conta
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
      active
        ? 'bg-unikiala-pink text-black shadow-neon'
        : 'text-gray-400 hover:text-white hover:bg-white/10'
    }`}
  >
    <span className="mr-2">{icon}</span>
    {label}
  </button>
);

const MobileNavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 rounded-xl font-bold transition-all ${
      active
        ? 'bg-unikiala-pink/20 text-unikiala-pink border border-unikiala-pink/50'
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </button>
);
