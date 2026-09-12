import React from 'react';
import { Sparkles, Film, Compass } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Manifesto Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1B1C1E] border border-[#383A3D] text-xs text-[#D6A85F] font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#D6A85F]" />
          <span>Product Manifesto</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#F2F0EB] font-normal tracking-tight uppercase leading-tight">
          Movies, chosen by feeling.
        </h1>
        <p className="text-sm text-[#A8A7A3] font-normal max-w-2xl mx-auto leading-relaxed pt-1">
          CINEVIBE is a modern, minimal, vibe-driven recommendation platform designed around the human experience rather than clinical genre labels.
        </p>
      </div>

      {/* Philosophy Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#383A3D]">
        <div className="bg-[#1B1C1E] border border-[#383A3D] rounded-xl p-6 space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#151617] border border-[#383A3D] flex items-center justify-center text-[#D6A85F]">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#F2F0EB]">The Core Differentiator</h3>
          <p className="text-xs text-[#A8A7A3] leading-relaxed font-sans">
            Traditional platforms ask: <em className="text-[#F2F0EB] font-medium">"Do you want Action or Comedy?"</em><br/><br/>
            CINEVIBE asks: <em className="text-[#F2F0EB] font-medium">"What kind of emotional journey do you need right now?"</em> Whether it's the hunger of building an empire, the grit of rising from defeat, or the quiet warmth of a cozy night.
          </p>
        </div>

        <div className="bg-[#1B1C1E] border border-[#383A3D] rounded-xl p-6 space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#151617] border border-[#383A3D] flex items-center justify-center text-[#D6A85F]">
            <Film className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#F2F0EB]">Indian & World Cinema</h3>
          <p className="text-xs text-[#A8A7A3] leading-relaxed font-sans">
            Starting with a curated dataset of over 360+ landmark Indian films (spanning Hindi, Telugu, Malayalam, Tamil, Kannada, Marathi, Bengali, and Assamese) enriched with TMDB global masterpieces.
          </p>
        </div>
      </div>

      {/* Feature Principles */}
      <div className="space-y-4 pt-2">
        <h3 className="font-serif text-2xl text-[#F2F0EB] text-center font-normal">
          System Metrics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[#1B1C1E] border border-[#383A3D] text-center space-y-1">
            <div className="text-[#D6A85F] font-serif text-2xl font-bold">25</div>
            <div className="text-xs text-[#F2F0EB] font-semibold">Vibe Dimensions</div>
            <div className="text-[11px] text-[#73736F]">
              Rule-based & vector scores for thematic matching.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1B1C1E] border border-[#383A3D] text-center space-y-1">
            <div className="text-[#D6A85F] font-serif text-2xl font-bold">0.0 - 1.0</div>
            <div className="text-xs text-[#F2F0EB] font-semibold">Relevance Scoring</div>
            <div className="text-[11px] text-[#73736F]">
              Weighted ranking matching multiple selected vibes simultaneously.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1B1C1E] border border-[#383A3D] text-center space-y-1">
            <div className="text-[#D6A85F] font-serif text-2xl font-bold">1-Click</div>
            <div className="text-xs text-[#F2F0EB] font-semibold">Google Search Sync</div>
            <div className="text-[11px] text-[#73736F]">
              Directly launches web search for instant viewing options.
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Footer Signature */}
      <div className="pt-8 border-t border-[#383A3D] text-center text-xs text-[#73736F] space-y-1">
        <div className="flex items-center justify-center gap-2 font-serif font-bold text-[#F2F0EB] text-sm uppercase tracking-widest">
          <Film className="w-4 h-4 text-[#D6A85F]" /> CINEVIBE
        </div>
        <p>© 2026 CINEVIBE. Built for vibe-based movie discovery.</p>
      </div>
    </div>
  );
};
