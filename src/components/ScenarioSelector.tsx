import React from 'react';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios.js';
import { SampleScenario } from '../types/veris.js';

interface ScenarioSelectorProps {
  onSelectScenario: (scenario: SampleScenario) => void;
  activeScenarioId?: string | null;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  onSelectScenario,
  activeScenarioId,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-[#18221D]">Sample Test Scenarios</span>
        <span className="text-[#6B7280]">Select a real-world scenario to test</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SAMPLE_SCENARIOS.map((scenario) => {
          const isSelected = activeScenarioId === scenario.id;
          return (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className={`text-left p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#EBF3EE] border-[#1B4332] shadow-xs'
                  : 'bg-white hover:bg-[#FAF9F5] border-[#E4E8E3] hover:border-[#1B4332]/40 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 text-[11px] text-[#4E6559] mb-1 font-medium">
                  <span>{scenario.badge}</span>
                  <span className="truncate max-w-[120px]">{scenario.category}</span>
                </div>
                <div className="font-semibold text-[#18221D] leading-tight mb-1.5">
                  {scenario.title}
                </div>
                <p className="text-[11px] text-[#6B7280] line-clamp-2 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#F0F2EE] flex items-center justify-between text-[11px]">
                <span className="text-[#1B4332] font-semibold">Load scenario &rarr;</span>
                {isSelected && (
                  <span className="text-[#4E6559] font-medium text-[10px]">Loaded</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
