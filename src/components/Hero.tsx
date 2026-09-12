import React, { useState } from 'react';
import { Search, Sparkles, HelpCircle, ArrowRight, Check } from 'lucide-react';
import { VIBE_DEFINITIONS, VibeDefinition } from '../data/vibeDefinitions';

interface HeroProps {
  selectedVibes: string[];
  onToggleVibe: (vibeId: string) => void;
  onNaturalLanguageQuery: (query: string) => void;
  onOpenPickForMe: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  selectedVibes,
  onToggleVibe,
  onNaturalLanguageQuery,
  onOpenPickForMe,
}) => {
  const [nlInput, setNlInput] = useState('');

  const popularVibes = VIBE_DEFINITIONS.filter((v) => v.popular);

  const handleNlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nlInput.trim()) {
      onNaturalLanguageQuery(nlInput.trim());
    }
  };

  return (
    <section className="bg-[#0D0E0F] pt-14 pb-16 md:pt-20 md:pb-24 border-b border-[#383A3D]/70 relative overflow-hidden">
      
      {/* Subtle atmospheric vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#151617]/50 via-transparent to-[#0D0E0F] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Subtitle tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1B1C1E] border border-[#383A3D] text-xs text-[#A8A7A3] tracking-widest uppercase mb-6 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#D6A85F]" />
          <span>Not a genre. A feeling.</span>
        </div>

        {/* Cinematic Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#F2F0EB] max-w-4xl mx-auto leading-[1.08] uppercase">
          WHAT DO YOU FEEL LIKE WATCHING?
        </h1>
        <p className="text-sm sm:text-base text-[#A8A7A3] mt-4 font-normal max-w-xl mx-auto leading-relaxed">
          Discover movies based on vibe, personality, theme, and emotional experience.
        </p>

        {/* Natural Language Prompt Input */}
        <div className="mt-10 max-w-2xl mx-auto">
          <form onSubmit={handleNlSubmit} className="relative">
            <div className="flex items-center bg-[#1B1C1E] border border-[#383A3D] focus-within:border-[#8F6B36] rounded-xl p-1.5 transition-colors shadow-subtle">
              <Search className="w-5 h-5 text-[#73736F] ml-3.5 mr-2 shrink-0" />
              <input
                type="text"
                value={nlInput}
                onChange={(e) => setNlInput(e.target.value)}
                placeholder="Describe your mood, e.g. 'Inspiring business movie from India after 2000'..."
                className="w-full bg-transparent text-sm text-[#F2F0EB] placeholder-[#73736F] focus:outline-none py-2 px-1 font-sans"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[#D6A85F] hover:bg-[#E2BA73] text-[#11100E] text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Find</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick suggestions */}
          <div className="mt-3 flex items-center justify-center flex-wrap gap-2 text-xs text-[#73736F]">
            <span>Try:</span>
            <button
              onClick={() => {
                setNlInput('Indian movie about ambition and business after 2000');
                onNaturalLanguageQuery('Indian movie about ambition and business after 2000');
              }}
              className="text-[#A8A7A3] hover:text-[#D6A85F] underline transition-colors"
            >
              "Indian movie about ambition & business"
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setNlInput('Feel good Korean story about friendship');
                onNaturalLanguageQuery('Feel good Korean story about friendship');
              }}
              className="text-[#A8A7A3] hover:text-[#D6A85F] underline transition-colors"
            >
              "Feel good Korean friendship"
            </button>
          </div>
        </div>

        {/* Vibe Selection Grid */}
        <div className="mt-12 pt-10 border-t border-[#383A3D]/60">
          <div className="flex items-center justify-between mb-4 max-w-4xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#73736F] font-semibold">
              Select Vibes
            </span>
            <button
              onClick={onOpenPickForMe}
              className="text-xs text-[#D6A85F] hover:underline flex items-center gap-1 font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#A8A7A3]" />
              I don't know. Pick for me.
            </button>
          </div>

          {/* Graphite + Champagne Vibe Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {popularVibes.map((vibe: VibeDefinition) => {
              const isSelected = selectedVibes.includes(vibe.id);
              return (
                <button
                  key={vibe.id}
                  onClick={() => onToggleVibe(vibe.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#28231A] text-[#D6A85F] border border-[#8F6B36] font-semibold'
                      : 'bg-[#1B1C1E] text-[#A8A7A3] border border-[#383A3D] hover:bg-[#232426] hover:text-[#F2F0EB]'
                  }`}
                >
                  <span>{vibe.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#D6A85F]" />}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
