import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Sparkles, Edit3 } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface HeroSummaryProps {
  name: string;
  onChangeName: (val: string) => void;
  date: string;
  guests: number;
  city: string;
  type: string;
}

export const HeroSummary: React.FC<HeroSummaryProps> = ({
  name,
  onChangeName,
  date,
  guests,
  city,
  type
}) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number }>({
    d: 0,
    h: 0,
    m: 0,
    s: 0
  });
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);

  useEffect(() => {
    if (!date) return;

    const updateTimer = () => {
      const target = new Date(`${date}T00:00:00`);
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({ d, h, m, s });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [date]);

  const typeLabels: Record<string, string> = {
    wedding: 'Royal Wedding Celebration',
    birthday: 'Milestone Celebration',
    anniversary: 'Silver / Golden Gala',
    corporate: 'Corporate Leadership Summit',
    community: 'Community Festival',
    party: 'Celebration Soiree',
    other: 'Bespoke Gathering'
  };

  return (
    <section className="relative overflow-hidden border-b border-slate-200/90 bg-gradient-to-b from-white via-slate-50/50 to-white py-8 sm:py-10 shadow-xs dark:border-slate-800/90 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 transition-colors">
      {/* Subtle Ambient Decorative Gradients */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-64 w-96 rounded-full bg-indigo-500/5 blur-3xl dark:bg-indigo-500/10" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-96 rounded-full bg-pink-500/5 blur-3xl dark:bg-pink-500/10" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Title & Metadata Left Zone */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-3.5 w-3.5 text-pink-500" />
              <span className="uppercase tracking-wider text-[11px] font-bold">
                {typeLabels[type] || type.toUpperCase()}
              </span>
            </div>

            <div
              className="relative group"
              onMouseEnter={() => setIsHoveringTitle(true)}
              onMouseLeave={() => setIsHoveringTitle(false)}
            >
              <input
                type="text"
                value={name}
                onChange={(e) => onChangeName(e.target.value)}
                aria-label="Event Title"
                placeholder="Name your event..."
                className="w-full rounded-xl border border-transparent bg-transparent py-1 text-2xl font-extrabold tracking-tight text-slate-900 hover:border-slate-300/80 hover:bg-slate-100/50 focus:border-indigo-500 focus:bg-white focus:outline-none sm:text-3xl lg:text-4xl dark:text-white dark:hover:border-slate-700 dark:hover:bg-slate-800/50 dark:focus:border-indigo-500 dark:focus:bg-slate-850 transition-all cursor-text pr-10"
              />
              <div
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none transition-opacity ${
                  isHoveringTitle ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Edit3 className="h-4 w-4" />
              </div>
            </div>

            {/* Clean Unboxed Metadata with Typographic Separators */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm pt-1">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
                <span>{formatDate(date)}</span>
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-pink-500 shrink-0" />
                <span className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                  {guests}
                </span>
                <span>Confirmed Pax Target</span>
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>{city || 'Destination TBA'}</span>
              </span>
            </div>
          </div>

          {/* Countdown Clock Right Zone */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200/90 bg-white/80 p-5 shadow-xs backdrop-blur-md dark:border-slate-800/90 dark:bg-slate-900/80">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400 mb-3">
                <span>Countdown to Celebration</span>
                {timeLeft.d > 0 && (
                  <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold lowercase">
                    in {timeLeft.d} days
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                {/* Days */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 leading-none tabular-nums">
                    {String(timeLeft.d).padStart(2, '0')}
                  </div>
                  <div className="mt-1.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Days
                  </div>
                </div>

                {/* Hours */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 leading-none tabular-nums">
                    {String(timeLeft.h).padStart(2, '0')}
                  </div>
                  <div className="mt-1.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Hours
                  </div>
                </div>

                {/* Mins */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 leading-none tabular-nums">
                    {String(timeLeft.m).padStart(2, '0')}
                  </div>
                  <div className="mt-1.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Mins
                  </div>
                </div>

                {/* Secs */}
                <div className="rounded-xl border border-pink-100 bg-pink-50/50 p-3 dark:border-pink-950/40 dark:bg-pink-950/20">
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-pink-600 dark:text-pink-400 leading-none tabular-nums">
                    {String(timeLeft.s).padStart(2, '0')}
                  </div>
                  <div className="mt-1.5 text-[10px] font-bold tracking-wider text-pink-600/80 uppercase dark:text-pink-400/80">
                    Secs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
