
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { authService } from '../services/authService';
import { Mail, Lock, User as UserIcon, ArrowRight, PartyPopper, CheckCircle, ShieldCheck } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  
  // Verification States
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isVerifying) {
      await handleVerification();
      return;
    }

    if (isLogin) {
      const result = await authService.login(email, password);
      if (result.user) {
        onLogin(result.user);
      } else {
        setError(result.error || 'Erro ao fazer login.');
      }
    } else {
      if (!name || !email || !password) {
        setError('Preencha todos os campos.');
        return;
      }
      
      const result = await authService.signup(name, email, password, role);
      if (result.error) {
        setError(result.error);
      } else if (result.user && result.code) {
        // Simulating Email Sending
        alert(`[SIMULAÇÃO EMAIL] Olá ${result.user.name}, seu código de verificação UNIKIALA é: ${result.code}`);
        setIsVerifying(true);
        setError('');
      }
    }
  };

  const handleVerification = async () => {
    if (!verificationCode) {
      setError('Insira o código de verificação.');
      return;
    }

    const result = await authService.verifyUser(email, verificationCode);
    if (result.success && result.user) {
      onLogin(result.user);
    } else {
      setError(result.error || 'Código inválido.');
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
                 {isVerifying ? <ShieldCheck className="text-white w-6 h-6" /> : <PartyPopper className="text-white w-6 h-6" />}
               </div>
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">UNIKIALA</h1>
            <p className="text-gray-400 text-sm">
              {isVerifying 
                ? 'Verifique sua conta para continuar.' 
                : isLogin ? 'Bem-vindo de volta ao espetáculo.' : 'Crie sua conta e viva a cultura.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            {isVerifying ? (
              // VERIFICATION FORM
              <div className="animate-in slide-in-from-right duration-300 space-y-5">
                <div className="text-center mb-4">
                   <p className="text-sm text-gray-300">Enviamos um código para:</p>
                   <p className="font-bold text-white">{email}</p>
                </div>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Código de 6 dígitos"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={`${inputClass} text-center tracking-widest text-lg`}
                    maxLength={6}
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-green-500/20"
                >
                  Verificar Email
                </button>
                <button
                  type="button"
                  onClick={() => setIsVerifying(false)}
                  className="w-full text-gray-400 hover:text-white text-sm py-2"
                >
                  Voltar / Corrigir Email
                </button>
              </div>
            ) : (
              // LOGIN / SIGNUP FORM
              <div className="space-y-5 animate-in fade-in duration-300">
                {!isLogin && (
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

                {!isLogin && (
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
                  className="w-full bg-white text-black hover:bg-unikiala-pink font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center group"
                >
                  {isLogin ? 'Entrar na Plataforma' : 'Criar Conta'}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-8 text-center">
                  <p className="text-gray-400 text-sm">
                    {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                      }}
                      className="ml-2 text-unikiala-pink font-bold hover:underline"
                    >
                      {isLogin ? 'Cadastre-se' : 'Fazer Login'}
                    </button>
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
