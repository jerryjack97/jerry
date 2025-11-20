import React from 'react';
import { Mail, Phone, User, Shield, FileText, Code, Globe, MapPin } from 'lucide-react';

const PageLayout: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center p-4 bg-unikiala-pink/10 rounded-full text-unikiala-pink mb-4 border border-unikiala-pink/30 shadow-neon">
        {icon}
      </div>
      <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">{title}</h1>
      <div className="h-1 w-24 bg-gradient-to-r from-transparent via-unikiala-pink to-transparent mx-auto"></div>
    </div>
    <div className="bg-unikiala-surface border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
      {children}
    </div>
  </div>
);

export const About: React.FC = () => (
  <PageLayout title="Sobre Nós" icon={<User className="w-8 h-8" />}>
    <div className="space-y-8 text-gray-300 leading-relaxed">
      <p className="text-xl font-light text-white">
        A <strong className="text-unikiala-pink">UNIKIALA</strong> nasceu com o propósito de revolucionar a forma como a cultura é vivida e consumida. Somos a ponte digital que conecta artistas, organizadores e o público apaixonado por experiências únicas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-2 font-display">A Nossa Missão</h3>
          <p>Simplificar o acesso à cultura, garantindo segurança, rapidez e modernidade no agendamento e compra de ingressos para eventos em Angola e além.</p>
        </div>
        <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-2 font-display">A Nossa Visão</h3>
          <p>Ser a plataforma número um de entretenimento e gestão de eventos, impulsionada pela tecnologia e pela paixão pela arte.</p>
        </div>
      </div>

      <div className="mt-16 border-t border-white/10 pt-10">
        <h2 className="text-2xl font-display font-bold text-white mb-8 text-center">A Mente por Trás do Código</h2>
        
        <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-unikiala-pink/10 to-purple-900/10 p-8 rounded-3xl border border-unikiala-pink/20">
          
          {/* Seção da Imagem do Owner */}
          <div className="relative shrink-0 group mx-auto md:mx-0">
            <div className="absolute -inset-3 bg-gradient-to-r from-unikiala-pink to-purple-600 rounded-full blur-lg opacity-40 group-hover:opacity-75 transition duration-500"></div>
            <img 
              src="https://placehold.co/400x400/050505/FF00FF?text=Jerry+Cambinda" 
              alt="Jerry Francisco Lussendo Cambinda" 
              className="relative w-40 h-40 rounded-full object-cover border-2 border-unikiala-pink shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            {/* Badge de Programador */}
            <div className="absolute bottom-0 right-0 bg-black border border-unikiala-pink text-unikiala-pink p-2 rounded-full shadow-neon">
               <Code className="w-5 h-5" />
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold text-white mb-1">Jerry Francisco Lussendo Cambinda</h3>
            <p className="text-unikiala-pink font-bold uppercase tracking-widest text-sm mb-4">Owner & Lead Developer</p>
            <p className="text-gray-400">
              Visionário, empreendedor e programador. Jerry combina sua expertise técnica com um profundo apreço pela cultura para criar soluções digitais que fazem a diferença. A arquitetura e o design do UNIKIALA refletem sua dedicação à excelência e inovação.
            </p>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
);

export const Contact: React.FC = () => (
  <PageLayout title="Contactos" icon={<Globe className="w-8 h-8" />}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="col-span-1 md:col-span-2 text-center mb-8">
        <p className="text-xl text-gray-300">
          Estamos prontos para atender você. Entre em contacto com a nossa equipa executiva.
        </p>
      </div>

      <div className="bg-black/40 p-8 rounded-2xl border border-white/10 hover:border-unikiala-pink/50 transition-colors group text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-unikiala-pink/20 transition-colors">
          <Phone className="w-8 h-8 text-unikiala-pink" />
        </div>
        <h3 className="text-lg font-bold text-white mb-4">Telefones</h3>
        <div className="space-y-2">
          <a href="tel:+8617543995682" className="block text-2xl font-display font-bold text-gray-300 hover:text-white transition-colors">
            +86 17543995682
          </a>
          <a href="tel:+8613167395906" className="block text-2xl font-display font-bold text-gray-300 hover:text-white transition-colors">
            +86 13167395906
          </a>
        </div>
      </div>

      <div className="bg-black/40 p-8 rounded-2xl border border-white/10 hover:border-unikiala-pink/50 transition-colors group text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-unikiala-pink/20 transition-colors">
          <Mail className="w-8 h-8 text-unikiala-pink" />
        </div>
        <h3 className="text-lg font-bold text-white mb-4">Email Oficial</h3>
        <a href="mailto:jerrycambinda58@gmail.com" className="block text-xl font-bold text-gray-300 hover:text-white transition-colors break-all">
          jerrycambinda58@gmail.com
        </a>
      </div>

      <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-gray-900 to-black p-8 rounded-2xl border border-white/5 flex items-center justify-center">
         <MapPin className="w-5 h-5 text-gray-500 mr-3" />
         <span className="text-gray-400">Escritório Global de Desenvolvimento & Operações</span>
      </div>
    </div>
  </PageLayout>
);

export const Terms: React.FC = () => (
  <PageLayout title="Termos de Uso" icon={<FileText className="w-8 h-8" />}>
    <div className="prose prose-invert prose-pink max-w-none space-y-6 text-gray-300">
      <h3 className="text-xl font-bold text-white font-display">1. Aceitação dos Termos</h3>
      <p>
        Ao acessar e usar o aplicativo UNIKIALA, você aceita e concorda em estar vinculado aos termos e disposições deste acordo.
      </p>

      <h3 className="text-xl font-bold text-white font-display">2. Serviços Oferecidos</h3>
      <p>
        A UNIKIALA fornece uma plataforma para organizadores de eventos publicarem, promoverem e venderem ingressos, e para usuários descobrirem e adquirirem esses serviços. A UNIKIALA atua como intermediária tecnológica.
      </p>

      <h3 className="text-xl font-bold text-white font-display">3. Responsabilidades do Organizador</h3>
      <p>
        Os organizadores são inteiramente responsáveis pela veracidade das informações dos eventos, realização dos mesmos e pela política de reembolso, salvo quando intermediado diretamente pela nossa garantia.
      </p>

      <h3 className="text-xl font-bold text-white font-display">4. Pagamentos e Taxas</h3>
      <p>
        As transações são processadas de forma segura. Taxas de serviço e entrega podem ser aplicadas conforme descrito no momento do checkout. Os planos de assinatura para organizadores não são reembolsáveis após ativação.
      </p>
    </div>
  </PageLayout>
);

export const Privacy: React.FC = () => (
  <PageLayout title="Privacidade" icon={<Shield className="w-8 h-8" />}>
    <div className="prose prose-invert prose-pink max-w-none space-y-6 text-gray-300">
      <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 mb-6">
        <p className="text-yellow-200 font-bold text-sm">
          Seus dados são sagrados para nós. Não vendemos suas informações para terceiros.
        </p>
      </div>

      <h3 className="text-xl font-bold text-white font-display">1. Coleta de Informações</h3>
      <p>
        Coletamos informações que você nos fornece diretamente, como nome, número de telefone e detalhes de pagamento ao comprar ingressos ou criar uma conta de organizador.
      </p>

      <h3 className="text-xl font-bold text-white font-display">2. Uso das Informações</h3>
      <p>
        Usamos as informações para processar transações, enviar confirmações de ingressos, fornecer suporte ao cliente e melhorar nossos serviços. O número de WhatsApp é utilizado para facilitar a comunicação entre comprador e organizador.
      </p>

      <h3 className="text-xl font-bold text-white font-display">3. Segurança de Dados</h3>
      <p>
        Implementamos medidas de segurança projetadas para proteger suas informações contra acesso não autorizado. Utilizamos criptografia em todas as transações de dados sensíveis.
      </p>
    </div>
  </PageLayout>
);