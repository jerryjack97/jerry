import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { authService } from '../services/authService';
import { Mail, Lock, User as UserIcon, ArrowRight, PartyPopper, KeyRound, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'LOGIN' | 'SIGNUP' | 'RECOVERY';

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('LOGIN');
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (authMode === 'LOGIN') {
        const result = await authService.login(email, password);
        if (result.user) {
          onLogin(result.user);
        } else {
          setError(result.error || 'Erro ao fazer login.');
        }
      } else if (authMode === 'SIGNUP') {
        if (!name || !email || !password) {
          setError('Preencha todos os campos.');
          setIsLoading(false);
          return;
        }
        
        const result = await authService.signup(name, email, password, role);
        if (result.error) {
          setError(result.error);
        } else if (result.user) {
          onLogin(result.user);
        }
      } else if (authMode === 'RECOVERY') {
        if (!email) {
          setError('Insira seu email para recuperar a senha.');
          setIsLoading(false);
          return;
        }
        const result = await authService.resetPassword(email);
        if (result.error) {
          setError(result.error);
        } else {
          setSuccessMessage('Link de recuperação enviado! Verifique seu email (e a caixa de spam).');
          // Opcional: Limpar campo
          // setEmail('');
        }
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-black/50 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-unikiala-pink focus:ring-1 focus:ring-unikiala-pink outline-none transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-unikiala-black relative overflow-hidden px-4">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-unikiala-pink/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/30 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-unikiala-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 md:p-10 animate-in fade-in zoom-in duration-500">
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
               <div className="w-12 h-12 bg-gradient-to-br from-unikiala-pink to-purple-700 rounded-full flex items-center justify-center shadow-neon">
                 {authMode === 'RECOVERY' ? (
                    <KeyRound className="text-white w-6 h-6" />
                 ) : (
                    <PartyPopper className="text-white w-6 h-6" />
                 )}
               </div>
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">UNIKIALA</h1>
            <p className="text-gray-400 text-sm">
              {authMode === 'LOGIN' && 'Bem-vindo de volta ao espetáculo.'}
              {authMode === 'SIGNUP' && 'Crie sua conta e viva a cultura.'}
              {authMode === 'RECOVERY' && 'Recupere o acesso à sua conta.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl text-center animate-in slide-in-from-top-2">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 text-sm p-3 rounded-xl text-center animate-in slide-in-from-top-2">
                {successMessage}
              </div>
            )}

            <div className="space-y-5 animate-in fade-in duration-300">
              {authMode === 'SIGNUP' && (
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Seu Nome Completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Seu Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              {authMode !== 'RECOVERY' && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="password"
                    placeholder="Sua Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}

              {/* Forgot Password Link */}
              {authMode === 'LOGIN' && (
                <div className="text-right">
                  <button 
                    type="button"
                    onClick={() => { setAuthMode('RECOVERY'); setError(''); setSuccessMessage(''); }}
                    className="text-xs text-gray-400 hover:text-unikiala-pink transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              {authMode === 'SIGNUP' && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.USER)}
                    className={`py-2 rounded-lg border text-sm font-bold transition-all ${role === UserRole.USER ? 'bg-unikiala-pink text-black border-unikiala-pink' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}
                  >
                    Sou Cliente
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.ORGANIZER)}
                    className={`py-2 rounded-lg border text-sm font-bold transition-all ${role === UserRole.ORGANIZER ? 'bg-purple-600 text-white border-purple-600' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}
                  >
                    Sou Organizador
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-unikiala-pink font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center group disabled:opacity-70"
              >
                {isLoading ? 'Processando...' : (
                  <>
                    {authMode === 'LOGIN' && 'Entrar na Plataforma'}
                    {authMode === 'SIGNUP' && 'Criar Conta'}
                    {authMode === 'RECOVERY' && 'Enviar Link de Recuperação'}
                    {authMode !== 'RECOVERY' && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                  </>
                )}
              </button>

              <div className="mt-8 text-center">
                {authMode === 'RECOVERY' ? (
                  <button
                    type="button"
                    onClick={() => { setAuthMode('LOGIN'); setError(''); setSuccessMessage(''); }}
                    className="text-gray-400 text-sm hover:text-white flex items-center justify-center mx-auto"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Login
                  </button>
                ) : (
                  <p className="text-gray-400 text-sm">
                    {authMode === 'LOGIN' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
                        setError('');
                        setSuccessMessage('');
                      }}
                      className="ml-2 text-unikiala-pink font-bold hover:underline"
                    >
                      {authMode === 'LOGIN' ? 'Cadastre-se' : 'Fazer Login'}
                    </button>
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};