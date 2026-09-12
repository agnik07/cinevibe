import React from 'react';
import { Sparkles, RefreshCw, Filter } from 'lucide-react';
import { FilterState } from '../types';

interface EmptyStateProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetAll: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  filters,
  onFilterChange,
  onResetAll,
}) => {
  return (
    <div className="py-20 px-4 max-w-xl mx-auto text-center">
      <div className="w-14 h-14 rounded-full bg-[#1B1C1E] border border-[#383A3D] flex items-center justify-center text-[#D6A85F] mx-auto mb-6">
        <Sparkles className="w-6 h-6 text-[#D6A85F]" />
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl text-[#F2F0EB] font-normal tracking-tight mb-2">
        That's a very specific mood.
      </h2>
      <p className="text-sm text-[#A8A7A3] font-normal max-w-md mx-auto leading-relaxed mb-8">
        We couldn't find a perfect match in our current collection for this exact combination of filters.
      </p>

      {/* Suggested Actions */}
      <div className="bg-[#1B1C1E] border border-[#383A3D] rounded-xl p-5 mb-8 text-left">
        <h4 className="text-xs uppercase tracking-wider text-[#D6A85F] font-semibold mb-3.5 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#D6A85F]" />
          Suggested Filter Adjustments:
        </h4>

        <div className="space-y-2.5">
          {filters.country && filters.country !== 'All Countries' && (
            <button
              onClick={() => onFilterChange({ country: 'All Countries' })}
              className="w-full p-3 rounded-lg bg-[#151617] hover:bg-[#232426] border border-[#383A3D] text-xs text-[#F2F0EB] flex items-center justify-between transition-colors"
            >
              <span>Remove Country constraint ({filters.country})</span>
              <span className="text-[#D6A85F] font-semibold">Relax filter →</span>
            </button>
          )}

          {filters.rating > 7.5 && (
            <button
              onClick={() => onFilterChange({ rating: 7.5 })}
              className="w-full p-3 rounded-lg bg-[#151617] hover:bg-[#232426] border border-[#383A3D] text-xs text-[#F2F0EB] flex items-center justify-between transition-colors"
            >
              <span>Lower rating threshold to ★ 7.5+</span>
              <span className="text-[#D6A85F] font-semibold">Relax filter →</span>
            </button>
          )}

          {(filters.yearMin || filters.yearMax) && (
            <button
              onClick={() => onFilterChange({ yearMin: undefined, yearMax: undefined })}
              className="w-full p-3 rounded-lg bg-[#151617] hover:bg-[#232426] border border-[#383A3D] text-xs text-[#F2F0EB] flex items-center justify-between transition-colors"
            >
              <span>Expand year range to include all eras</span>
              <span className="text-[#D6A85F] font-semibold">Relax filter →</span>
            </button>
          )}

          {filters.vibes.length > 2 && (
            <button
              onClick={() => onFilterChange({ vibes: filters.vibes.slice(0, 1) })}
              className="w-full p-3 rounded-lg bg-[#151617] hover:bg-[#232426] border border-[#383A3D] text-xs text-[#F2F0EB] flex items-center justify-between transition-colors"
            >
              <span>Focus on primary vibe ({filters.vibes[0]})</span>
              <span className="text-[#D6A85F] font-semibold">Simplify →</span>
            </button>
          )}
        </div>
      </div>

      <button
        onClick={onResetAll}
        className="px-6 py-3 rounded-lg bg-[#D6A85F] hover:bg-[#E2BA73] text-[#11100E] text-xs uppercase tracking-wider font-bold transition-colors inline-flex items-center gap-2 shadow-subtle"
      >
        <RefreshCw className="w-3.5 h-3.5 text-[#11100E]" />
        Reset All Filters
      </button>
    </div>
  );
};
