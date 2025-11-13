'use client';

import { useState } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Textarea } from './textarea';
import { Label } from './label';

interface DailyJournalProps {
  initialMood?: number;
  initialEnergy?: number;
  initialSleep?: number;
  initialText?: string;
  onSave: (data: {
    mood_rating: number;
    energy_rating: number;
    sleep_quality: number;
    journal_text: string;
  }) => Promise<void>;
}

export function DailyJournal({ 
  initialMood = 5, 
  initialEnergy = 5, 
  initialSleep = 5,
  initialText = '',
  onSave 
}: DailyJournalProps) {
  const [mood, setMood] = useState(initialMood);
  const [energy, setEnergy] = useState(initialEnergy);
  const [sleep, setSleep] = useState(initialSleep);
  const [text, setText] = useState(initialText);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        mood_rating: mood,
        energy_rating: energy,
        sleep_quality: sleep,
        journal_text: text
      });
      alert('Journal entry saved!');
    } catch (error) {
      alert('Failed to save journal entry');
    } finally {
      setIsSaving(false);
    }
  };

  const SliderInput = ({ 
    label, 
    value, 
    onChange, 
    lowLabel, 
    highLabel 
  }: { 
    label: string; 
    value: number; 
    onChange: (val: number) => void;
    lowLabel: string;
    highLabel: string;
  }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm sm:text-base text-[var(--text)] font-medium">{label}</Label>
        <span className="text-xl sm:text-2xl font-bold text-[var(--accent)]">{value}</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-[var(--surface-2)] rounded-full appearance-none cursor-pointer accent-[var(--accent)]"
        style={{
          background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${(value - 1) * 11.11}%, var(--surface-2) ${(value - 1) * 11.11}%, var(--surface-2) 100%)`
        }}
      />
      <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <SliderInput
          label="Mood"
          value={mood}
          onChange={setMood}
          lowLabel="😞 Low"
          highLabel="😊 High"
        />
        
        <SliderInput
          label="Energy"
          value={energy}
          onChange={setEnergy}
          lowLabel="😴 Tired"
          highLabel="⚡ Energized"
        />
        
        <SliderInput
          label="Sleep Quality"
          value={sleep}
          onChange={setSleep}
          lowLabel="😵 Poor"
          highLabel="😌 Excellent"
        />
      </div>

      <div>
        <Label htmlFor="journal" className="text-sm sm:text-base text-[var(--text)] font-medium mb-2 block">
          How are you feeling today? Any observations?
        </Label>
        <Textarea
          id="journal"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe your overall well-being, any changes you've noticed, thoughts about your stack..."
          rows={5}
          className="bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] leading-relaxed text-sm sm:text-base"
        />
      </div>

      <Button
        type="submit"
        disabled={isSaving}
        className="w-full bg-gradient-to-b from-[#22C8FF] to-[#08A7E6] hover:opacity-90 text-[#001018] rounded-full font-semibold py-5 sm:py-6 text-base sm:text-lg"
      >
        {isSaving ? 'Saving...' : 'Save Journal Entry'}
      </Button>
    </form>
  );
}

