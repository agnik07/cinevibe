import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Check } from 'lucide-react';

interface PickForMeQuizProps {
  onClose: () => void;
  onCompleteQuiz: (selectedVibes: string[]) => void;
}

export const PickForMeQuiz: React.FC<PickForMeQuizProps> = ({
  onClose,
  onCompleteQuiz,
}) => {
  const [step, setStep] = useState(1);
  const [emotionLevel, setEmotionLevel] = useState<string>('');
  const [storyType, setStoryType] = useState<string>('');
  const [endingType, setEndingType] = useState<string>('');

  const EMOTION_OPTIONS = [
    { label: '🙂 Light & Easy', vibes: ['fun', 'feel_good'] },
    { label: '😊 Warm & Feel Good', vibes: ['feel_good', 'friendship', 'family'] },
    { label: '🥹 Deeply Emotional', vibes: ['emotions', 'romance', 'life_lessons'] },
    { label: '😭 Destroy Me', vibes: ['emotions', 'truth_reality', 'dark_intense'] },
  ];

  const STORY_OPTIONS = [
    { label: '🚀 Ambition & High Stakes', vibes: ['ambition', 'business', 'motivation'] },
    { label: '❤️ Love & Passionate Romance', vibes: ['romance', 'emotions'] },
    { label: '🌱 Life Lessons & Self Discovery', vibes: ['self_discovery', 'life_lessons', 'philosophical'] },
    { label: '🤝 Unshakeable Friendship', vibes: ['friendship', 'courage'] },
    { label: '🕵️ Mystery, Twists & Mind Games', vibes: ['mystery_mindgames', 'dark_intense'] },
    { label: '💼 Building a Business Empire', vibes: ['business', 'entrepreneurship', 'success'] },
    { label: '🔥 Failure & Comeback Story', vibes: ['failure_comeback', 'resilience', 'motivation'] },
  ];

  const ENDING_OPTIONS = [
    { label: '🌟 Hopeful & Triumphant', vibes: ['success', 'motivation', 'feel_good'] },
    { label: '🍂 Bittersweet & Realistic', vibes: ['truth_reality', 'life_lessons'] },
    { label: '⚡ Unexpected Mind Twist', vibes: ['mystery_mindgames'] },
    { label: '🎬 Surprise Me with Anything', vibes: [] },
  ];

  const handleFinish = () => {
    const matchedVibes: string[] = [];

    const emo = EMOTION_OPTIONS.find((e) => e.label === emotionLevel);
    if (emo) matchedVibes.push(...emo.vibes);

    const story = STORY_OPTIONS.find((s) => s.label === storyType);
    if (story) matchedVibes.push(...story.vibes);

    const end = ENDING_OPTIONS.find((e) => e.label === endingType);
    if (end) matchedVibes.push(...end.vibes);

    const uniqueVibes = Array.from(new Set(matchedVibes));
    onCompleteQuiz(uniqueVibes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#28292B] border border-[#383A3D] rounded-xl p-6 sm:p-7 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#73736F] hover:text-[#F2F0EB] bg-[#151617] rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#28231A] border border-[#8F6B36] text-xs text-[#D6A85F] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D6A85F]" />
            <span>Quiz Step {step} of 3</span>
          </div>
        </div>

        {/* STEP 1: Emotion Level */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-[#F2F0EB] font-normal tracking-tight">
              How much emotional damage are we going for tonight?
            </h3>
            <p className="text-xs text-[#73736F]">Choose your current emotional tolerance level.</p>

            <div className="space-y-2 pt-1">
              {EMOTION_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setEmotionLevel(opt.label)}
                  className={`w-full p-3 rounded-lg text-left border transition-colors flex items-center justify-between text-xs font-medium ${
                    emotionLevel === opt.label
                      ? 'bg-[#28231A] border-[#8F6B36] text-[#D6A85F] font-semibold'
                      : 'bg-[#1B1C1E] border-[#383A3D] text-[#A8A7A3] hover:bg-[#232426] hover:text-[#F2F0EB]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {emotionLevel === opt.label && <Check className="w-4 h-4 text-[#D6A85F]" />}
                </button>
              ))}
            </div>

            <button
              disabled={!emotionLevel}
              onClick={() => setStep(2)}
              className="w-full py-2.5 rounded-lg bg-[#D6A85F] hover:bg-[#E2BA73] disabled:opacity-40 text-[#11100E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-5 transition-colors shadow-subtle"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Story Type */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-[#F2F0EB] font-normal tracking-tight">
              What kind of story do you want to experience?
            </h3>
            <p className="text-xs text-[#73736F]">Pick the central narrative engine.</p>

            <div className="space-y-2 max-h-60 overflow-y-auto pt-1">
              {STORY_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setStoryType(opt.label)}
                  className={`w-full p-3 rounded-lg text-left border transition-colors flex items-center justify-between text-xs font-medium ${
                    storyType === opt.label
                      ? 'bg-[#28231A] border-[#8F6B36] text-[#D6A85F] font-semibold'
                      : 'bg-[#1B1C1E] border-[#383A3D] text-[#A8A7A3] hover:bg-[#232426] hover:text-[#F2F0EB]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {storyType === opt.label && <Check className="w-4 h-4 text-[#D6A85F]" />}
                </button>
              ))}
            </div>

            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 rounded-lg bg-[#1B1C1E] text-[#A8A7A3] hover:text-[#F2F0EB] text-xs font-semibold uppercase tracking-wider border border-[#383A3D]"
              >
                Back
              </button>
              <button
                disabled={!storyType}
                onClick={() => setStep(3)}
                className="w-2/3 py-2.5 rounded-lg bg-[#D6A85F] hover:bg-[#E2BA73] disabled:opacity-40 text-[#11100E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-subtle"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Ending Style */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-[#F2F0EB] font-normal tracking-tight">
              What kind of ending destination do you prefer?
            </h3>
            <p className="text-xs text-[#73736F]">Final touch to calibrate recommendation matrix.</p>

            <div className="space-y-2 pt-1">
              {ENDING_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setEndingType(opt.label)}
                  className={`w-full p-3 rounded-lg text-left border transition-colors flex items-center justify-between text-xs font-medium ${
                    endingType === opt.label
                      ? 'bg-[#28231A] border-[#8F6B36] text-[#D6A85F] font-semibold'
                      : 'bg-[#1B1C1E] border-[#383A3D] text-[#A8A7A3] hover:bg-[#232426] hover:text-[#F2F0EB]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {endingType === opt.label && <Check className="w-4 h-4 text-[#D6A85F]" />}
                </button>
              ))}
            </div>

            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-2.5 rounded-lg bg-[#1B1C1E] text-[#A8A7A3] hover:text-[#F2F0EB] text-xs font-semibold uppercase tracking-wider border border-[#383A3D]"
              >
                Back
              </button>
              <button
                disabled={!endingType}
                onClick={handleFinish}
                className="w-2/3 py-2.5 rounded-lg bg-[#D6A85F] hover:bg-[#E2BA73] disabled:opacity-40 text-[#11100E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-subtle"
              >
                <span>Show Recommendations</span>
                <Sparkles className="w-4 h-4 text-[#11100E]" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
