import React from 'react';
import { InfiniteSlider } from './src/components/ui/InfiniteSlider'; // Changed path accordingly
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

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

const hubFeatures = [
  { icon: Search, label: 'Pesquisa Competitiva' },
  { icon: Flame, label: 'Radar de Trends' },
  { icon: Target, label: 'Content Gaps' },
  { icon: RefreshCw, label: 'Content Recycler' },
  { icon: BarChart3, label: 'Auditoria SEO' },
  { icon: Zap, label: 'Plano Editorial' },
  { icon: Shield, label: 'Brand Monitoring' },
  { icon: Globe, label: 'Market Insights' },
  { icon: Rocket, label: 'Execution Engine' },
  { icon: Sparkles, label: 'Native Gemini 2.0' },
];

export function LogoCloud({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-5xl mx-auto py-4", className)}>
      <div className="relative overflow-hidden py-6 px-4 rounded-3xl border border-primary/10 bg-black/40 backdrop-blur-sm group/cloud">
        {/* Edge Masking */}
        <div className="absolute inset-x-0 inset-y-0 z-10 pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
          }}
        />

        <InfiniteSlider gap={60} reverse speed={15} className="w-full relative z-0">
          {hubFeatures.map((feature, i) => (
            <div key={i} className="flex items-center gap-3 px-6 py-2 rounded-full border border-white/5 bg-white/[0.03] whitespace-nowrap">
              <feature.icon className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-foreground/70 uppercase tracking-widest">{feature.label}</span>
            </div>
          ))}
        </InfiniteSlider>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-primary/20 rounded-tl-xl opacity-40"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-primary/20 rounded-tr-xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-primary/20 rounded-bl-xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-primary/20 rounded-br-xl opacity-40"></div>
      </div>
    </div>
  );
}
