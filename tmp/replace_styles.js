const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../src/App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// The replacement mapping
const replacements = [
  // Typography Colors
  { from: /text-brand-text-muted/g, to: 'text-muted-foreground' },
  { from: /text-brand-text/g, to: 'text-foreground' },
  { from: /text-brand-orange/g, to: 'text-primary' },
  { from: /text-black\/80/g, to: 'text-foreground/80' },
  { from: /text-black\/60/g, to: 'text-muted-foreground' },
  { from: /text-black\/40/g, to: 'text-muted-foreground/80' },
  { from: /text-white\/80/g, to: 'text-muted-foreground' },
  { from: /text-white\/60/g, to: 'text-muted-foreground' },
  { from: /text-black/g, to: 'text-foreground' },
  
  // Notice: text-white might be inside primary buttons, so it's safer to leave text-white 
  // or replace it with text-primary-foreground ONLY if it represents text on top of a colored background.
  // Actually, replacing text-white with text-foreground might break 'bg-primary text-white'.
  // Let's replace 'text-white' when it's just a general color, but I'll only do it conditionally if need be.
  // Let's replace text-white with text-foreground generally? No, if it's on a button, it should be text-primary-foreground.
  // Since we use the CSS var for text, I will skip text-white globally, but wait! The headers and icons use text-white.
  // Let's assume text-white is meant to be the main text color in some dark mode panels.
  // We can replace `"text-white"` (with quotes or spaces) carefully.
  { from: /([ \t"'\`])text-white([ \t"'\`])/g, to: '$1text-foreground$2' },

  // Background Colors
  { from: /bg-brand-bg/g, to: 'bg-background' },
  { from: /bg-brand-card-accent/g, to: 'bg-accent' },
  { from: /bg-brand-card/g, to: 'bg-card' },
  { from: /bg-brand-orange/g, to: 'bg-primary' },
  
  { from: /bg-white\/40/g, to: 'bg-card' },
  { from: /bg-white\/20/g, to: 'bg-accent' },
  { from: /bg-white\/10/g, to: 'bg-muted' },
  { from: /bg-white\/5/g, to: 'bg-muted/50' },
  
  { from: /bg-black\/40/g, to: 'bg-card' },
  { from: /bg-black\/10/g, to: 'bg-muted' },
  { from: /bg-black\/5/g, to: 'bg-muted/50' },
  { from: /bg-black/g, to: 'bg-foreground' },

  // Border Colors
  { from: /border-brand-border/g, to: 'border-border' },
  { from: /border-brand-orange/g, to: 'border-primary' },

  { from: /border-white\/60/g, to: 'border-border' },
  { from: /border-white\/40/g, to: 'border-border' },
  { from: /border-white\/20/g, to: 'border-border' },
  { from: /border-white\/10/g, to: 'border-border' },
  { from: /border-white\/5/g, to: 'border-border' },

  { from: /border-black\/20/g, to: 'border-border' },
  { from: /border-black\/10/g, to: 'border-border' },
  { from: /border-black\/5/g, to: 'border-border' },
  
  // Shadows
  { from: /shadow-brand-orange/g, to: 'shadow-primary' },
  
  // Specific fix for icons that are specifically colored inside a circle
  // We can't generically catch all, but the standard text-foreground will handle most.
];

let changedContent = content;
replacements.forEach(r => {
  changedContent = changedContent.replace(r.from, r.to);
});

// Extra fix: "bg-primary text-foreground" for elements that used to be brand-orange + white
// We should change buttons to have text-primary-foreground
changedContent = changedContent.replace(/bg-primary([^"'\`>]*)text-foreground/g, 'bg-primary$1text-primary-foreground');

// Also, some hardcoded structural classes:
changedContent = changedContent.replace(/glass-card/g, 'card-elevated');
// Since some of the font-black uppercase is brutalist, let's tone it down a bit to match the design system
changedContent = changedContent.replace(/font-black uppercase tracking-widest/g, 'font-semibold');
changedContent = changedContent.replace(/font-black uppercase tracking-tight/g, 'font-semibold');

fs.writeFileSync(appPath, changedContent, 'utf8');
console.log('App.tsx styles successfully replaced!');
