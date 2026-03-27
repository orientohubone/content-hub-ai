import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Search, 
  TrendingUp, 
  Shield, 
  RefreshCw, 
  Eye, 
  Settings, 
  Key, 
  BarChart3, 
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Globe,
  LayoutGrid,
  Sparkles,
  Flame,
  ArrowUpRight,
  Plus,
  Asterisk
} from 'lucide-react';
import { translations, Language } from '../translations';

interface LandingPageProps {
  onEnter: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function LandingPage({ onEnter, language, setLanguage }: LandingPageProps) {
  const t = translations[language];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text selection:bg-brand-orange/30 font-sans overflow-x-hidden">
      {/* Navigation - Minimalist Pill Style */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-6">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full h-14 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Asterisk size={20} className="text-brand-orange" />
            <span className="font-black text-sm uppercase tracking-widest">Network</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-[11px] uppercase font-bold tracking-widest text-brand-text-muted hover:text-white transition-colors">{t.nav.about}</a>
            <a href="#" className="text-[11px] uppercase font-bold tracking-widest text-brand-text-muted hover:text-white transition-colors">{t.nav.products}</a>
            <a href="#" className="text-[11px] uppercase font-bold tracking-widest text-brand-text-muted hover:text-white transition-colors">{t.nav.solutions}</a>
            <a href="#" className="text-[11px] uppercase font-bold tracking-widest text-brand-text-muted hover:text-white transition-colors">{t.nav.company}</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
              <button 
                onClick={() => setLanguage('en')}
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${language === 'en' ? 'text-brand-orange' : 'text-brand-text-muted hover:text-white'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('pt')}
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${language === 'pt' ? 'text-brand-orange' : 'text-brand-text-muted hover:text-white'}`}
              >
                PT
              </button>
            </div>
            <button className="text-[11px] uppercase font-bold tracking-widest text-brand-text-muted hover:text-white transition-colors">
              {t.nav.login}
            </button>
            <button 
              onClick={onEnter}
              className="bg-white text-black px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-all"
            >
              {t.nav.enterHub}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Central Glow & Expressive Type */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/20 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center space-y-8 max-w-5xl"
        >
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-text-muted">
            {t.hero.subtitle}
          </p>
          
          <h1 className="text-6xl md:text-[110px] font-black leading-[0.85] tracking-tighter">
            {t.hero.title1} <Zap size={40} className="inline-block text-brand-orange -mt-4 mx-2" /> <span className="text-brand-orange italic">{t.hero.title2}</span> {t.hero.title3} <br />
            <Asterisk size={40} className="inline-block text-brand-orange -mt-4 mx-2" /> {t.hero.title4} <span className="italic">{t.hero.title5}</span>
          </h1>

          <div className="flex justify-center">
            <button 
              onClick={onEnter}
              className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group hover:border-brand-orange transition-all"
            >
              <ArrowUpRight size={24} className="group-hover:text-brand-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>
          </div>
        </motion.div>

        {/* Stats Grid - Minimalist */}
        <div className="absolute bottom-20 left-0 w-full px-20 hidden lg:grid grid-cols-4 gap-20">
          <StatItem label={t.stats.analyzed} value="93m+" />
          <StatItem label={t.stats.market} value="3.2b" />
          <StatItem label={t.stats.awards} value="1k+" />
          <StatItem label={t.stats.transactions} value="221k" />
        </div>
      </section>

      {/* Section 01 - About Network Style */}
      <section className="py-40 px-6 max-w-7xl mx-auto space-y-20">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-brand-text-muted">01</span>
          <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
            <span className="text-[10px] uppercase font-black tracking-widest">{t.about.badge}</span>
            <Asterisk size={12} className="text-brand-orange" />
            <span className="text-[10px] uppercase font-black tracking-widest">{t.about.network}</span>
          </div>
        </div>

        <div className="space-y-12">
          <h2 className="text-4xl md:text-7xl font-black leading-[1.1] tracking-tight max-w-5xl">
            {t.about.title.split('Network').map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && (
                  <>
                    <span className="bg-brand-orange px-4 py-1 rounded-lg text-sm uppercase font-black tracking-widest mx-2">Network</span>
                  </>
                )}
              </React.Fragment>
            ))}
            <br />
            {t.about.team} <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/20 mx-2"><Globe size={16} /></span>
          </h2>

          {/* Bento Grid - Image Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {/* Card 1 - Light Gray */}
            <div className="bg-brand-card-accent rounded-[40px] p-10 space-y-12 h-[500px] flex flex-col justify-between group cursor-pointer hover:scale-[1.02] transition-all">
              <div className="flex justify-center">
                <Asterisk size={80} className="text-brand-orange" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-black">{t.about.card1Title}</h3>
                <p className="text-sm text-black/60 font-medium leading-relaxed">
                  {t.about.card1Desc}
                </p>
              </div>
            </div>

            {/* Card 2 - Mixed */}
            <div className="space-y-6 flex flex-col h-[500px]">
              <div className="bg-brand-orange rounded-[40px] p-8 flex items-center justify-between group cursor-pointer hover:bg-brand-orange-light transition-all">
                <span className="text-sm font-black uppercase tracking-widest">{t.about.card2Title}</span>
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                  <ArrowUpRight size={18} />
                </div>
              </div>
              <div className="flex-1 bg-brand-card-accent rounded-[40px] p-10 flex flex-col items-center justify-center text-center space-y-8">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <Asterisk size={40} className="text-brand-orange" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-widest text-black">{t.about.card2Badge}</p>
                  <p className="text-[10px] text-black/40 font-bold">{t.about.card2Desc}</p>
                </div>
              </div>
            </div>

            {/* Card 3 - Light Gray with Pills */}
            <div className="bg-brand-card-accent rounded-[40px] p-10 space-y-12 h-[500px] flex flex-col justify-between group cursor-pointer hover:scale-[1.02] transition-all">
              <div className="relative flex flex-col items-center justify-center flex-1">
                <Asterisk size={60} className="text-brand-orange mb-8" />
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-4 py-2 rounded-full bg-black/5 border border-black/10 text-[10px] font-black uppercase tracking-widest text-black/40">{t.about.threat}</span>
                  <span className="px-4 py-2 rounded-full bg-black/5 border border-black/10 text-[10px] font-black uppercase tracking-widest text-black/40">{t.about.threat}</span>
                  <span className="px-4 py-2 rounded-full bg-black/5 border border-black/10 text-[10px] font-black uppercase tracking-widest text-black/40">{t.about.threat}</span>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-black">{t.about.card3Title}</h3>
                <p className="text-sm text-black/60 font-medium leading-relaxed">
                  {t.about.card3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 02 - Investors Style */}
      <section className="py-40 px-6 max-w-7xl mx-auto space-y-20">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-brand-text-muted">02</span>
          <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
            <span className="text-[10px] uppercase font-black tracking-widest">{t.investors.badge}</span>
            <Asterisk size={12} className="text-brand-orange" />
            <span className="text-[10px] uppercase font-black tracking-widest">{t.about.network}</span>
          </div>
        </div>

        <h2 className="text-4xl md:text-7xl font-black leading-[1.1] tracking-tight">
          {t.investors.title.split('Network').map((part, i, arr) => (
            <React.Fragment key={i}>
              {part}
              {i < arr.length - 1 && (
                <>
                  <Asterisk size={32} className="inline-block mx-2 text-brand-orange" />
                  Network
                </>
              )}
            </React.Fragment>
          ))}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center pt-12">
          <InvestorLogo icon={<Globe size={32} />} />
          <InvestorLogo icon={<LayoutGrid size={32} />} />
          <InvestorLogo icon={<Sparkles size={32} />} />
          <div className="bg-brand-orange aspect-square rounded-full flex items-center justify-center group cursor-pointer">
            <span className="font-black text-xl uppercase tracking-tighter -rotate-12 group-hover:rotate-0 transition-all">Slice</span>
          </div>
          <InvestorLogo label="Petal" />
        </div>
      </section>

      {/* Footer - Minimalist */}
      <footer className="py-20 px-6 border-t border-white/5 text-center space-y-8">
        <div className="flex items-center justify-center gap-2">
          <Asterisk size={20} className="text-brand-orange" />
          <span className="font-black text-sm uppercase tracking-widest">Network Hub</span>
        </div>
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-text-muted">
          {t.footer.rights}
        </p>
      </footer>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-2xl font-black tracking-tight">{value}</p>
      <p className="text-[10px] uppercase font-bold tracking-widest text-brand-text-muted">{label}</p>
    </div>
  );
}

function InvestorLogo({ icon, label }: { icon?: React.ReactNode; label?: string }) {
  return (
    <div className="aspect-square rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer">
      {icon ? icon : <span className="font-black text-xl tracking-tight">{label}</span>}
    </div>
  );
}
