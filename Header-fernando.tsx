
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Language, TRANSLATIONS } from '../constants';
import BrandLogo from './BrandLogo';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenReports?: () => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, onOpenReports }) => {
  const t = TRANSLATIONS[lang].nav;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMobileGroup, setActiveMobileGroup] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Create language-specific URL
  const createLangUrl = (path: string): string => {
    return lang === 'EN' ? `/en${path}` : path;
  };

  // Handle language switch
  const handleLanguageSwitch = (newLang: Language) => {
    setLang(newLang);
    const currentPath = window.location.pathname;
    if (newLang === 'EN' && !currentPath.startsWith('/en')) {
      navigate(`/en${currentPath}`);
    } else if (newLang === 'PT' && currentPath.startsWith('/en')) {
      navigate(currentPath.replace('/en', ''));
    }
  };

  const navGroups = [
    {
      id: 'systems',
      label: (t as any).groups.systems,
      items: [
        { label: t.strategy, href: "/capacidades" },
        { label: (t as any).frameworks, href: "/frameworks" },
        { label: t.practice, href: "/segmentos" },
      ]
    },
    {
      id: 'insights',
      label: (t as any).groups.insights,
      items: [
        { label: t.reports, href: "/relatorios" },
      ]
    },
    {
      id: 'direct',
      label: (t as any).groups.direct,
      items: [
        { label: t.about, href: "/sobre" },
        { label: t.philosophy, href: "/filosofia" },
        { label: t.creative, href: "https://www.behance.net/fernandoramalho1", external: true },
        { label: t.contact, href: "/contato" },
      ]
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4" role="banner">
      <div className="flex justify-center">
        <nav
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 relative overflow-visible ${isScrolled
            ? "bg-black/80 backdrop-blur-xl border-neutral-800/50 shadow-lg shadow-black/20"
            : "bg-black/40 backdrop-blur-md border-neutral-900/50"
            }`}
          role="navigation"
          aria-label="Navegação principal"
        >
          {/* Neon border beam effect - apenas bordas horizontais para evitar riscos nos cantos */}
          <div className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
            <div className="absolute inset-x-4 top-0 h-px">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-[#58B573] to-transparent opacity-80 animate-pulse shadow-[0_0_15px_rgba(88,181,115,0.8)]"></div>
            </div>
            <div className="absolute inset-x-4 bottom-0 h-px">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-[#58B573] to-transparent opacity-80 animate-pulse shadow-[0_0_15px_rgba(88,181,115,0.8)]"></div>
            </div>
          </div>
          {/* Logo */}
          <Link to={createLangUrl("/")} className="group py-2">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 ml-6">
            {navGroups.map((group) => (
              <div
                key={group.id}
                className="relative group/nav-item"
                onMouseEnter={() => setActiveDropdown(group.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all duration-300 ${activeDropdown === group.id ? 'text-white bg-white/5' : 'text-neutral-400 hover:text-white'}`}>
                  {group.label}
                  <svg
                    className={`w-2.5 h-2.5 transition-transform duration-300 ${activeDropdown === group.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${activeDropdown === group.id ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                >
                  <div className="bg-black/90 backdrop-blur-2xl border border-neutral-800/50 rounded-2xl p-2 min-w-[200px] shadow-2xl">
                    {group.items.map((item) => (
                      item.external ? (
                        <a
                          key={item.href}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black tracking-widest text-neutral-400 hover:text-white hover:bg-white/5 transition-all group/sub"
                        >
                          {item.label}
                          <svg className="w-2.5 h-2.5 opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          key={item.href}
                          to={createLangUrl(item.href)}
                          className="flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black tracking-widest text-neutral-400 hover:text-white hover:bg-white/5 transition-all group/sub"
                        >
                          {item.label}
                          <svg className="w-2.5 h-2.5 opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center gap-1 border border-neutral-800 rounded-full p-1 bg-black/50 backdrop-blur-md ml-4">
            <button
              onClick={() => handleLanguageSwitch('PT')}
              className={`text-[9px] font-black px-2 py-0.5 rounded-full transition-all ${lang === 'PT' ? 'bg-[#5AB473] text-black' : 'text-neutral-500 hover:text-white'}`}
            >
              PT
            </button>
            <button
              onClick={() => handleLanguageSwitch('EN')}
              className={`text-[9px] font-black px-2 py-0.5 rounded-full transition-all ${lang === 'EN' ? 'bg-[#5AB473] text-black' : 'text-neutral-500 hover:text-white'}`}
            >
              EN
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white ml-2"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center gap-1.5">
              <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-xl z-[60] transition-all duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute right-4 top-4 bottom-4 left-4 bg-[#0A0A0A] border border-neutral-800/50 rounded-[2rem] overflow-hidden flex flex-col transition-all duration-500 ${isMobileMenuOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
          <div className="p-8 flex justify-between items-center border-b border-neutral-900">
            <BrandLogo size="md" />
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {navGroups.map((group) => (
              <div key={group.id} className="space-y-2">
                <button
                  onClick={() => setActiveMobileGroup(activeMobileGroup === group.id ? null : group.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeMobileGroup === group.id ? 'bg-[#FFEE00] text-black' : 'bg-white/5 text-white'}`}
                >
                  <span className="text-sm font-black tracking-widest uppercase">{group.label}</span>
                  <svg className={`w-4 h-4 transition-transform duration-300 ${activeMobileGroup === group.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className={`overflow-hidden transition-all duration-500 ${activeMobileGroup === group.id ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-white/5 rounded-2xl p-2 space-y-1">
                    {group.items.map((item) => (
                      item.external ? (
                        <a
                          key={item.href}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 rounded-xl text-xs font-bold tracking-wider text-neutral-400"
                        >
                          {item.label}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          key={item.href}
                          to={createLangUrl(item.href)}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between p-4 rounded-xl text-xs font-bold tracking-wider text-neutral-400"
                        >
                          {item.label}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 border-t border-neutral-900 flex justify-center gap-4">
            <button
              onClick={() => handleLanguageSwitch('PT')}
              className={`flex-1 py-4 rounded-2xl text-xs font-black tracking-widest transition-all ${lang === 'PT' ? 'bg-[#5AB473] text-black shadow-[0_0_20px_rgba(90,180,115,0.3)]' : 'bg-white/5 text-neutral-500'}`}
            >
              PORTUGUÊS
            </button>
            <button
              onClick={() => handleLanguageSwitch('EN')}
              className={`flex-1 py-4 rounded-2xl text-xs font-black tracking-widest transition-all ${lang === 'EN' ? 'bg-[#5AB473] text-black shadow-[0_0_20px_rgba(90,180,115,0.3)]' : 'bg-white/5 text-neutral-500'}`}
            >
              ENGLISH
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
