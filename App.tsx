import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Organizer } from './pages/Organizer';
import { Admin } from './pages/Admin';
import { About, Contact, Terms, Privacy } from './pages/StaticPages';
import { Auth } from './pages/Auth';
import { UserRole, Event, OrganizerProfile, User } from './types';
import { INITIAL_EVENTS } from './constants';
import { authService } from './services/authService';
import { eventService } from './services/eventService';

const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Navigation State Logic
  const [history, setHistory] = useState<UserRole[]>([UserRole.USER]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  
  // Mock Organizer State (Synced with Auth in a real app, simplified here)
  const [organizerProfile, setOrganizerProfile] = useState<OrganizerProfile>({
    id: 'user_123',
    name: 'Produtora',
    isSubscribed: false
  });

  const currentRole = history[historyIndex];

  // Check for existing session on mount
  useEffect(() => {
    const initSession = async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setOrganizerProfile(prev => ({ ...prev, name: user.name, id: user.id }));
        if (user.role === UserRole.ORGANIZER) {
           setHistory([UserRole.ORGANIZER]);
        }
      }
      
      // Load Events from DB
      const dbEvents = await eventService.getEvents();
      setEvents(dbEvents);
      
      setIsLoading(false);
    };
    
    initSession();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setOrganizerProfile(prev => ({ ...prev, name: user.name, id: user.id }));
    // Redirect based on role
    const startRole = user.role === UserRole.ORGANIZER ? UserRole.ORGANIZER : UserRole.USER;
    setHistory([startRole]);
    setHistoryIndex(0);
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setHistory([UserRole.USER]);
    setHistoryIndex(0);
  };

  const navigateTo = (role: UserRole) => {
    if (role === currentRole) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(role);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  };

  const handleSubscribe = (planId: string) => {
    alert(`Processando pagamento para o plano: ${planId}... Pagamento confirmado!`);
    setOrganizerProfile(prev => ({
      ...prev,
      isSubscribed: true,
      subscriptionPlanId: planId
    }));
  };

  const handleAddEvent = async (newEventData: Omit<Event, 'id'>) => {
    try {
      const createdEvent = await eventService.createEvent(newEventData);
      if (createdEvent) {
         setEvents(prev => [createdEvent, ...prev]);
      }
    } catch (error) {
      alert("Erro ao criar evento no banco de dados.");
    }
  };

  const renderContent = () => {
    switch (currentRole) {
      case UserRole.USER:
        return <Home events={events} />;
      case UserRole.ORGANIZER:
        return (
          <Organizer 
            organizer={organizerProfile} 
            onSubscribe={handleSubscribe} 
            onAddEvent={handleAddEvent}
          />
        );
      case UserRole.ADMIN:
        return <Admin events={events} organizers={[organizerProfile]} />;
      case UserRole.ABOUT:
        return <About />;
      case UserRole.CONTACT:
        return <Contact />;
      case UserRole.TERMS:
        return <Terms />;
      case UserRole.PRIVACY:
        return <Privacy />;
      default:
        return <Home events={events} />;
    }
  };

  if (isLoading) return <div className="min-h-screen bg-unikiala-black flex items-center justify-center text-white">Carregando UNIKIALA...</div>;

  // Auth Guard
  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-unikiala-black">
      <Navbar 
        currentUser={currentUser}
        currentRole={currentRole} 
        setRole={navigateTo}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < history.length - 1}
        onBack={goBack}
        onForward={goForward}
        onLogout={handleLogout}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      
      <footer className="bg-black border-t border-white/10 pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 
            onClick={() => navigateTo(UserRole.USER)}
            className="text-2xl font-display font-bold text-white tracking-widest mb-4 cursor-pointer hover:text-unikiala-pink transition-colors inline-block"
          >
            UNIKIALA
          </h2>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <button onClick={() => navigateTo(UserRole.ABOUT)} className="text-gray-500 hover:text-unikiala-pink transition-colors font-medium">Sobre</button>
            <button onClick={() => navigateTo(UserRole.TERMS)} className="text-gray-500 hover:text-unikiala-pink transition-colors font-medium">Termos</button>
            <button onClick={() => navigateTo(UserRole.PRIVACY)} className="text-gray-500 hover:text-unikiala-pink transition-colors font-medium">Privacidade</button>
            <button onClick={() => navigateTo(UserRole.CONTACT)} className="text-gray-500 hover:text-unikiala-pink transition-colors font-medium">Contacto</button>
          </div>
          <p className="text-gray-700 text-sm">
            &copy; {new Date().getFullYear()} UNIKIALA. Cultura em movimento. <br/>
            <span className="text-gray-800 text-xs mt-2 block">Developed by Jerry F. L. Cambinda</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;