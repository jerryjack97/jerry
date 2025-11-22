
import React, { useRef, useState } from 'react';
import { UserRole, User } from '../types';
import { Ticket, Users, LayoutDashboard, Menu, ChevronLeft, ChevronRight, LogOut, User as UserIcon, X } from 'lucide-react';

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

  // Determinar permissões de visualização
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isOrganizer = currentUser?.role === UserRole.ORGANIZER;
  
  // Organizadores e Admins podem ver a aba Organizador
  const canAccessOrganizer = isAdmin || isOrganizer;
  // Apenas Admins podem ver a aba Admin
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
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-4 md:gap-8">
               {/* Logo */}
              <div 
                onClick={handleLogoClick}
                className="flex items-center group cursor-pointer select-none"
                title="Voltar ao Início"
              >
                <div className="w-1.5 h-6 md:w-2 md:h-8 bg-unikiala-pink mr-2 md:mr-3 rounded-full group-hover:shadow-neon transition-shadow duration-300"></div>
                <span className="text-xl md:text-3xl font-display font-bold text-white tracking-tighter group-hover:text-unikiala-pink transition-colors duration-300">
                  UNIKIALA
                </span>
              </div>

              {/* Navigation Controls - Desktop */}
              <div className="hidden md:flex items-center space-x-2">
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
            <div className="hidden md:flex space-x-1 bg-white/5 p-1 rounded-full border border-white/10">
              <NavButton 
                active={currentRole === UserRole.USER} 
                onClick={() => handleNavClick(UserRole.USER)} 
                icon={<Ticket className="w-4 h-4" />}
                label="Eventos"
              />
              
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

            {/* User Profile & Logout - Desktop */}
            <div className="hidden md:flex items-center gap-4">
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
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-white/10 group-hover:border-unikiala-pink transition-all ${currentRole === UserRole.PROFILE ? 'bg-unikiala-pink/20' : 'bg-white/10'}`}>
                    <UserIcon className={`w-4 h-4 ${currentRole === UserRole.PROFILE ? 'text-unikiala-pink' : 'text-gray-300'}`} />
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
            <div className="md:hidden flex items-center gap-2">
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
          <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl animate-in slide-in-from-top-5 z-40">
            <div className="px-4 py-6 space-y-4">
              {currentUser && (
                <button 
                  onClick={() => handleNavClick(UserRole.PROFILE)}
                  className="flex items-center w-full mb-6 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mr-3">
                    <UserIcon className="w-5 h-5 text-gray-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold">{currentUser.name}</p>
                    <p className="text-xs text-unikiala-pink">Ver Perfil Completo</p>
                  </div>
                </button>
              )}

              <MobileNavButton 
                active={currentRole === UserRole.USER} 
                onClick={() => handleNavClick(UserRole.USER)} 
                icon={<Ticket className="w-5 h-5" />}
                label="Eventos & Ingressos"
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