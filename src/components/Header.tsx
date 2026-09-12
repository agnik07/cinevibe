import React, { useState } from 'react';
import { Sparkles, Bookmark, Search, Compass, Film, Info, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeTab: 'discover' | 'explore' | 'watchlist' | 'about';
  setActiveTab: (tab: 'discover' | 'explore' | 'watchlist' | 'about') => void;
  onOpenSurpriseMe: () => void;
  onOpenSearch: () => void;
  watchlistCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSurpriseMe,
  onOpenSearch,
  watchlistCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0D0E0F] border-b border-[#383A3D]/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo / Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('discover')}
              className="group text-left flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1B1C1E] border border-[#383A3D] flex items-center justify-center text-[#D6A85F] group-hover:border-[#D6A85F]/60 transition-colors">
                <Film className="w-4 h-4 text-[#D6A85F]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl tracking-[0.2em] font-semibold text-[#F2F0EB] group-hover:text-[#D6A85F] transition-colors uppercase">
                  CINEVIBE
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#73736F] font-sans uppercase -mt-1">
                  Cinematic Discovery
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all flex items-center gap-2 ${
                activeTab === 'discover'
                  ? 'bg-[#1B1C1E] text-[#F2F0EB] border border-[#383A3D]'
                  : 'text-[#A8A7A3] hover:text-[#D6A85F] hover:bg-[#1B1C1E]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Discover
            </button>

            <button
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all flex items-center gap-2 ${
                activeTab === 'explore'
                  ? 'bg-[#1B1C1E] text-[#F2F0EB] border border-[#383A3D]'
                  : 'text-[#A8A7A3] hover:text-[#D6A85F] hover:bg-[#1B1C1E]'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Explore
            </button>

            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all flex items-center gap-2 relative ${
                activeTab === 'watchlist'
                  ? 'bg-[#1B1C1E] text-[#F2F0EB] border border-[#383A3D]'
                  : 'text-[#A8A7A3] hover:text-[#D6A85F] hover:bg-[#1B1C1E]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Watchlist
              {watchlistCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-[#D6A85F] text-[#11100E] rounded-md">
                  {watchlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all flex items-center gap-2 ${
                activeTab === 'about'
                  ? 'bg-[#1B1C1E] text-[#F2F0EB] border border-[#383A3D]'
                  : 'text-[#A8A7A3] hover:text-[#D6A85F] hover:bg-[#1B1C1E]'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              About
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-lg text-[#A8A7A3] hover:text-[#D6A85F] bg-[#1B1C1E] hover:bg-[#232426] border border-[#383A3D] transition-colors"
              title="Search movies"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Primary Champagne CTA Button */}
            <button
              onClick={onOpenSurpriseMe}
              className="px-4.5 py-2 rounded-lg text-xs font-semibold text-[#11100E] bg-[#D6A85F] hover:bg-[#E2BA73] transition-all flex items-center gap-2 active:scale-[0.98] shadow-subtle uppercase tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#11100E]" />
              Surprise Me
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenSurpriseMe}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#11100E] bg-[#D6A85F] flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-[#11100E]" />
              Surprise
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F2F0EB] hover:bg-[#1B1C1E] rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#383A3D] bg-[#151617] px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => { setActiveTab('discover'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-3 ${
              activeTab === 'discover' ? 'bg-[#1B1C1E] text-[#D6A85F]' : 'text-[#A8A7A3]'
            }`}
          >
            <Compass className="w-4 h-4 text-[#D6A85F]" /> Discover
          </button>
          <button
            onClick={() => { setActiveTab('explore'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-3 ${
              activeTab === 'explore' ? 'bg-[#1B1C1E] text-[#D6A85F]' : 'text-[#A8A7A3]'
            }`}
          >
            <Film className="w-4 h-4 text-[#D6A85F]" /> Explore Collections
          </button>
          <button
            onClick={() => { setActiveTab('watchlist'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-medium flex items-center justify-between ${
              activeTab === 'watchlist' ? 'bg-[#1B1C1E] text-[#D6A85F]' : 'text-[#A8A7A3]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bookmark className="w-4 h-4 text-[#D6A85F]" /> Watchlist
            </div>
            {watchlistCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-[#D6A85F] text-[#11100E] font-bold rounded-md">
                {watchlistCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-3 ${
              activeTab === 'about' ? 'bg-[#1B1C1E] text-[#D6A85F]' : 'text-[#A8A7A3]'
            }`}
          >
            <Info className="w-4 h-4 text-[#D6A85F]" /> About CINEVIBE
          </button>
          <button
            onClick={() => { onOpenSearch(); setMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-3 rounded-lg text-xs text-[#A8A7A3] hover:text-[#F2F0EB] flex items-center gap-3 border border-[#383A3D] bg-[#1B1C1E] mt-2"
          >
            <Search className="w-4 h-4 text-[#D6A85F]" /> Search by Title or Director
          </button>
        </div>
      )}
    </header>
  );
};
