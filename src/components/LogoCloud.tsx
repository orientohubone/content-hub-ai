import React from 'react';
import { InfiniteSlider } from './ui/InfiniteSlider';
import {
  Search,
  Flame,
  Target,
  RefreshCw,
  BarChart3,
  Zap,
  Shield,
  Globe,
  Rocket,
  Sparkles
} from 'lucide-react';

import { translations, Language } from '../translations';

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface LogoCloudProps {
  className?: string;
  language: Language;
}

export function LogoCloud({ className, language }: LogoCloudProps) {
  const t = translations[language];

  const hubFeatures = [
    { icon: Search, label: t.hero.logoCloud.competitive },
    { icon: Flame, label: t.hero.logoCloud.trends },
    { icon: Target, label: t.hero.logoCloud.gaps },
    { icon: RefreshCw, label: t.hero.logoCloud.recycler },
    { icon: BarChart3, label: t.hero.logoCloud.seo },
    { icon: Zap, label: t.hero.logoCloud.editorial },
    { icon: Shield, label: t.hero.logoCloud.brand },
    { icon: Globe, label: t.hero.logoCloud.insights },
    { icon: Rocket, label: t.hero.logoCloud.execution },
    { icon: Sparkles, label: t.hero.logoCloud.gemini },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .feature-cloud-container {
          background-color: rgba(255, 93, 0, 0.12) !important;
          border: 1px solid rgba(255, 93, 0, 0.25) !important;
          backdrop-filter: blur(24px) !important;
          -webkit-backdrop-filter: blur(24px) !important;
        }
        
        .dark .feature-cloud-container {
          background-color: rgba(0, 0, 0, 0.45) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }

        .feature-cloud-item {
          background-color: #ffffff !important;
          border: 1.5px solid rgba(255, 93, 0, 0.4) !important;
          color: #FF5D00 !important;
          box-shadow: 0 10px 25px -5px rgba(255, 93, 0, 0.15) !important;
        }

        .dark .feature-cloud-item {
          background-color: rgba(255, 255, 255, 0.04) !important;
          border: 1.5px solid rgba(255, 93, 0, 0.4) !important;
          color: rgba(255, 255, 255, 0.8) !important;
          box-shadow: none !important;
        }
      `}} />

      <div className={cn("w-full max-w-5xl mx-auto py-4", className)}>
        <div className="relative overflow-hidden py-10 px-4 rounded-[40px] feature-cloud-container group/cloud">
          {/* Edge Masking - Crystal clear edges */}
          <div className="absolute inset-x-0 inset-y-0 z-10 pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
            }}
          />

          <InfiniteSlider gap={60} reverse speed={8} className="w-full relative z-0">
            {hubFeatures.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-8 py-4 rounded-full feature-cloud-item whitespace-nowrap"
              >
                <feature.icon className="h-5 w-5" />
                <span className="text-[11px] font-black uppercase tracking-[0.25em]">{feature.label}</span>
              </div>
            ))}
          </InfiniteSlider>

          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-primary/30 rounded-tl-xl opacity-40"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-primary/30 rounded-tr-xl opacity-40"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-primary/30 rounded-bl-xl opacity-40"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-primary/30 rounded-br-xl opacity-40"></div>
        </div>
      </div>
    </>
  );
}
