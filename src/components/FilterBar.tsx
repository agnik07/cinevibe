import React, { useState } from 'react';
import { X, ChevronDown, Check, Globe, Star, Calendar, Languages, Sparkles } from 'lucide-react';
import { VIBE_DEFINITIONS, COUNTRY_OPTIONS, LANGUAGE_OPTIONS, ERA_OPTIONS, RATING_OPTIONS } from '../data/vibeDefinitions';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onClearAll: () => void;
  onApply: () => void;
  matchingCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  onApply,
  matchingCount,
}) => {
  const [openDropdown, setOpenDropdown] = useState<'vibe' | 'country' | 'language' | 'rating' | 'year' | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');

  const toggleDropdown = (name: 'vibe' | 'country' | 'language' | 'rating' | 'year') => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const filteredCountries = COUNTRY_OPTIONS.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredLanguages = LANGUAGE_OPTIONS.filter((l) =>
    l.toLowerCase().includes(languageSearch.toLowerCase())
  );

  const activeFilterCount =
    filters.vibes.length +
    (filters.country && filters.country !== 'All Countries' ? 1 : 0) +
    (filters.language && filters.language !== 'All Languages' ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (filters.yearMin || filters.yearMax ? 1 : 0);

  return (
    <div className="bg-[#0D0E0F] sticky top-16 sm:top-18 z-30 border-b border-[#383A3D]/70 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Dropdown Filters Group */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* 1. VIBE DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('vibe')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 border ${
                  filters.vibes.length > 0
                    ? 'bg-[#28231A] text-[#D6A85F] border-[#8F6B36] font-semibold'
                    : 'bg-[#1B1C1E] text-[#A8A7A3] border-[#383A3D] hover:bg-[#232426] hover:text-[#F2F0EB]'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${filters.vibes.length > 0 ? 'text-[#D6A85F]' : 'text-[#A8A7A3]'}`} />
                <span>Vibe {filters.vibes.length > 0 && `(${filters.vibes.length})`}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openDropdown === 'vibe' && (
                <div className="absolute top-full left-0 mt-2 w-80 sm:w-[440px] bg-[#28292B] border border-[#383A3D] rounded-xl shadow-subtle p-3.5 z-50 animate-fade-in max-h-[400px] overflow-y-auto">
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#383A3D]">
                    <span className="text-xs uppercase tracking-wider text-[#73736F] font-semibold">
                      Select Vibes ({filters.vibes.length})
                    </span>
                    {filters.vibes.length > 0 && (
                      <button
                        onClick={() => onFilterChange({ vibes: [] })}
                        className="text-xs text-[#D6A85F] hover:underline"
                      >
                        Clear vibes
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {VIBE_DEFINITIONS.map((vibe) => {
                      const isSelected = filters.vibes.includes(vibe.id);
                      return (
                        <button
                          key={vibe.id}
                          onClick={() => {
                            const newVibes = isSelected
                              ? filters.vibes.filter((v) => v !== vibe.id)
                              : [...filters.vibes, vibe.id];
                            onFilterChange({ vibes: newVibes });
                          }}
                          className={`p-2 rounded-lg text-left transition-colors border flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#28231A] border-[#8F6B36] text-[#D6A85F] font-semibold'
                              : 'bg-[#1B1C1E] border-[#383A3D] hover:bg-[#232426] text-[#A8A7A3] hover:text-[#F2F0EB]'
                          }`}
                        >
                          <div>
                            <div className="text-xs">{vibe.label}</div>
                            <div className={`text-[10px] line-clamp-1 ${isSelected ? 'text-[#D6A85F]/80' : 'text-[#73736F]'}`}>
                              {vibe.description}
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#D6A85F] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. COUNTRY DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('country')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 border ${
                  filters.country && filters.country !== 'All Countries'
                    ? 'bg-[#28231A] text-[#D6A85F] border-[#8F6B36] font-semibold'
                    : 'bg-[#1B1C1E] text-[#A8A7A3] border-[#383A3D] hover:bg-[#232426] hover:text-[#F2F0EB]'
                }`}
              >
                <Globe className={`w-3.5 h-3.5 ${filters.country && filters.country !== 'All Countries' ? 'text-[#D6A85F]' : 'text-[#A8A7A3]'}`} />
                <span>{filters.country || 'All Countries'}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openDropdown === 'country' && (
                <div className="absolute top-full left-0 mt-2 w-60 bg-[#28292B] border border-[#383A3D] rounded-xl shadow-subtle p-3 z-50 animate-fade-in">
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="w-full bg-[#151617] border border-[#383A3D] rounded-md px-2.5 py-1.5 text-xs text-[#F2F0EB] placeholder-[#73736F] focus:outline-none focus:border-[#8F6B36] mb-2"
                  />
                  <div className="max-h-52 overflow-y-auto space-y-1">
                    {filteredCountries.map((country) => (
                      <button
                        key={country}
                        onClick={() => {
                          onFilterChange({ country });
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between ${
                          filters.country === country
                            ? 'bg-[#28231A] text-[#D6A85F] font-semibold'
                            : 'text-[#A8A7A3] hover:text-[#F2F0EB] hover:bg-[#232426]'
                        }`}
                      >
                        <span>{country}</span>
                        {filters.country === country && <Check className="w-3.5 h-3.5 text-[#D6A85F]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. LANGUAGE DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('language')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 border ${
                  filters.language && filters.language !== 'All Languages'
                    ? 'bg-[#28231A] text-[#D6A85F] border-[#8F6B36] font-semibold'
                    : 'bg-[#1B1C1E] text-[#A8A7A3] border-[#383A3D] hover:bg-[#232426] hover:text-[#F2F0EB]'
                }`}
              >
                <Languages className={`w-3.5 h-3.5 ${filters.language && filters.language !== 'All Languages' ? 'text-[#D6A85F]' : 'text-[#A8A7A3]'}`} />
                <span>{filters.language || 'All Languages'}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openDropdown === 'language' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#28292B] border border-[#383A3D] rounded-xl shadow-subtle p-3 z-50 animate-fade-in">
                  <input
                    type="text"
                    placeholder="Search language..."
                    value={languageSearch}
                    onChange={(e) => setLanguageSearch(e.target.value)}
                    className="w-full bg-[#151617] border border-[#383A3D] rounded-md px-2.5 py-1.5 text-xs text-[#F2F0EB] placeholder-[#73736F] focus:outline-none focus:border-[#8F6B36] mb-2"
                  />
                  <div className="max-h-52 overflow-y-auto space-y-1">
                    {filteredLanguages.map((language) => (
                      <button
                        key={language}
                        onClick={() => {
                          onFilterChange({ language });
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between ${
                          filters.language === language
                            ? 'bg-[#28231A] text-[#D6A85F] font-semibold'
                            : 'text-[#A8A7A3] hover:text-[#F2F0EB] hover:bg-[#232426]'
                        }`}
                      >
                        <span>{language}</span>
                        {filters.language === language && <Check className="w-3.5 h-3.5 text-[#D6A85F]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. RATING DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('rating')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 border ${
                  filters.rating > 0
                    ? 'bg-[#28231A] text-[#D6A85F] border-[#8F6B36] font-semibold'
                    : 'bg-[#1B1C1E] text-[#A8A7A3] border-[#383A3D] hover:bg-[#232426] hover:text-[#F2F0EB]'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${filters.rating > 0 ? 'text-[#D6A85F] fill-[#D6A85F]' : 'text-[#A8A7A3]'}`} />
                <span>{filters.rating > 0 ? `Rating ${filters.rating}+` : 'Rating'}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openDropdown === 'rating' && (
                <div className="absolute top-full left-0 mt-2 w-44 bg-[#28292B] border border-[#383A3D] rounded-xl shadow-subtle p-2 z-50 animate-fade-in">
                  {RATING_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onFilterChange({ rating: opt.value });
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between ${
                        filters.rating === opt.value
                          ? 'bg-[#28231A] text-[#D6A85F] font-semibold'
                          : 'text-[#A8A7A3] hover:text-[#F2F0EB] hover:bg-[#232426]'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {filters.rating === opt.value && <Check className="w-3.5 h-3.5 text-[#D6A85F]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 5. YEAR DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('year')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 border ${
                  filters.yearMin || filters.yearMax
                    ? 'bg-[#28231A] text-[#D6A85F] border-[#8F6B36] font-semibold'
                    : 'bg-[#1B1C1E] text-[#A8A7A3] border-[#383A3D] hover:bg-[#232426] hover:text-[#F2F0EB]'
                }`}
              >
                <Calendar className={`w-3.5 h-3.5 ${filters.yearMin || filters.yearMax ? 'text-[#D6A85F]' : 'text-[#A8A7A3]'}`} />
                <span>
                  {filters.yearMin ? `${filters.yearMin}+` : filters.yearMax ? `Before ${filters.yearMax}` : 'Era'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openDropdown === 'year' && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-[#28292B] border border-[#383A3D] rounded-xl shadow-subtle p-3 z-50 animate-fade-in">
                  <div className="space-y-1 mb-2.5">
                    {ERA_OPTIONS.map((era) => (
                      <button
                        key={era.label}
                        onClick={() => {
                          onFilterChange({ yearMin: era.min, yearMax: era.max });
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between ${
                          filters.yearMin === era.min && filters.yearMax === era.max
                            ? 'bg-[#28231A] text-[#D6A85F] font-semibold'
                            : 'text-[#A8A7A3] hover:text-[#F2F0EB] hover:bg-[#232426]'
                        }`}
                      >
                        <span>{era.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Year Inputs */}
                  <div className="pt-2 border-t border-[#383A3D]">
                    <span className="text-[10px] text-[#73736F] uppercase tracking-wider block mb-1">
                      Custom Range
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        placeholder="From"
                        value={filters.yearMin || ''}
                        onChange={(e) =>
                          onFilterChange({ yearMin: e.target.value ? parseInt(e.target.value) : undefined })
                        }
                        className="w-1/2 bg-[#151617] border border-[#383A3D] rounded-md px-2 py-1 text-xs text-[#F2F0EB] focus:outline-none focus:border-[#8F6B36]"
                      />
                      <span className="text-[#73736F] text-xs">to</span>
                      <input
                        type="number"
                        placeholder="To"
                        value={filters.yearMax || ''}
                        onChange={(e) =>
                          onFilterChange({ yearMax: e.target.value ? parseInt(e.target.value) : undefined })
                        }
                        className="w-1/2 bg-[#151617] border border-[#383A3D] rounded-md px-2 py-1 text-xs text-[#F2F0EB] focus:outline-none focus:border-[#8F6B36]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Primary Action Button: FIND MY MOVIES */}
          <div className="flex items-center gap-2 ml-auto">
            {activeFilterCount > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-[#73736F] hover:text-[#F2F0EB] underline transition-colors px-2 py-1"
              >
                Clear all ({activeFilterCount})
              </button>
            )}

            <button
              onClick={onApply}
              className="px-5 py-2 rounded-lg bg-[#D6A85F] hover:bg-[#E2BA73] text-[#11100E] font-bold text-xs tracking-wider uppercase transition-colors shadow-subtle flex items-center gap-2 active:scale-[0.98]"
            >
              <span>FIND MY MOVIES</span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#11100E]/15 text-[11px] font-bold">
                {matchingCount}
              </span>
            </button>
          </div>

        </div>

        {/* Active Removable Chips Row */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-[#383A3D]/60">
            <span className="text-[10px] uppercase tracking-wider text-[#73736F] font-semibold mr-1">
              Active:
            </span>

            {/* Vibe chips */}
            {filters.vibes.map((vibeId) => {
              const def = VIBE_DEFINITIONS.find((v) => v.id === vibeId);
              return (
                <span
                  key={vibeId}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#28231A] border border-[#8F6B36] text-[#D6A85F] text-xs font-semibold"
                >
                  ✦ {def?.label || vibeId}
                  <button
                    onClick={() =>
                      onFilterChange({ vibes: filters.vibes.filter((v) => v !== vibeId) })
                    }
                    className="hover:text-[#F2F0EB] ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}

            {/* Country chip */}
            {filters.country && filters.country !== 'All Countries' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1B1C1E] border border-[#383A3D] text-[#F2F0EB] text-xs font-medium">
                {filters.country}
                <button onClick={() => onFilterChange({ country: 'All Countries' })} className="hover:text-[#D6A85F] ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Language chip */}
            {filters.language && filters.language !== 'All Languages' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1B1C1E] border border-[#383A3D] text-[#F2F0EB] text-xs font-medium">
                {filters.language}
                <button onClick={() => onFilterChange({ language: 'All Languages' })} className="hover:text-[#D6A85F] ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Rating chip */}
            {filters.rating > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#28231A] border border-[#8F6B36] text-[#D6A85F] text-xs font-medium">
                ★ {filters.rating}+
                <button onClick={() => onFilterChange({ rating: 0 })} className="hover:text-[#F2F0EB] ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Year chip */}
            {(filters.yearMin || filters.yearMax) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1B1C1E] border border-[#383A3D] text-[#F2F0EB] text-xs font-medium">
                {filters.yearMin ? `${filters.yearMin}+` : `Before ${filters.yearMax}`}
                <button
                  onClick={() => onFilterChange({ yearMin: undefined, yearMax: undefined })}
                  className="hover:text-[#D6A85F] ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
