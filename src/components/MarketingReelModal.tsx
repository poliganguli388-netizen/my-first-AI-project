import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  Square,
  Monitor,
  Flame,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  FileText,
  DollarSign,
  ShieldCheck,
  Star,
  Music,
  Send,
  Zap,
  Clock,
  Layers,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface Scene {
  sceneNumber: number;
  timeCode: string;
  visualAction: string;
  onScreenText: string;
  voiceover: string;
  soundEffect: string;
}

interface ReelData {
  title: string;
  hook: string;
  scenes: Scene[];
  socialCaption: string;
  musicStyle: string;
}

const DEFAULT_REEL: ReelData = {
  title: "The Death of The Event Planning Spreadsheet 💀",
  hook: "Stop planning million-dollar events with 14 messy spreadsheet tabs.",
  scenes: [
    {
      sceneNumber: 1,
      timeCode: "0:00 - 0:05",
      visualAction: "Chaotic spreadsheet cells overflow with budget deficits and missed vendor deadlines. Alarm sirens flash before an instant transformation to EventCraft AI's glass dashboard.",
      onScreenText: "STILL USING SPREADSHEETS? 🛑",
      voiceover: "If you're still planning your dream wedding or milestone summit on a chaotic spreadsheet, you're one vendor invoice away from a total meltdown.",
      soundEffect: "Record scratch followed by modern 808 bass drop"
    },
    {
      sceneNumber: 2,
      timeCode: "0:05 - 0:10",
      visualAction: "One-click starter blueprint triggered. Gemini AI instantly generates 8 budget categories, 16-week timeline, and vendor quotes in under 2 seconds.",
      onScreenText: "1-CLICK AI EVENT BLUEPRINT ⚡",
      voiceover: "Meet EventCraft AI. Select your celebration, enter your budget, and watch our AI engineer a complete master roadmap in three seconds.",
      soundEffect: "Satisfying whoosh + high-tech chime"
    },
    {
      sceneNumber: 3,
      timeCode: "0:10 - 0:16",
      visualAction: "The new Predictive Spending Radar in action. Real-time trend forecasting flags a 12% overrun drift, then turns emerald green with simulated vendor negotiation savings.",
      onScreenText: "PREDICTIVE OVERRUN RADAR 📈",
      voiceover: "The killer feature: A live predictive radar that catches spending drift weeks before invoices arrive and unlocks thousands in vendor negotiation savings.",
      soundEffect: "Cash register ding + heartbeat pulse"
    },
    {
      sceneNumber: 4,
      timeCode: "0:16 - 0:21",
      visualAction: "Minute-by-minute day-of run sheet scrolling with precise cues for DJ, photographer, and catering leads.",
      onScreenText: "DAY-OF RUN SHEET FOR DJS & LEADS ⏱️",
      voiceover: "Airtight day-of run sheets for your coordinators. Every cue, vendor arrival, and sound transition is locked down.",
      soundEffect: "Camera shutter + chime"
    },
    {
      sceneNumber: 5,
      timeCode: "0:21 - 0:26",
      visualAction: "One-tap direct WhatsApp invite engine with zero app downloads, showing live dietary tracking across Veg, Vegan, and Jain options.",
      onScreenText: "1-TAP WHATSAPP RSVP + DIET RADAR 📱",
      voiceover: "Send personalized WhatsApp invitations in one tap. Instant RSVPs, dietary breakdowns, and zero apps for your guests to download.",
      soundEffect: "Message notification pop + sparkle"
    },
    {
      sceneNumber: 6,
      timeCode: "0:26 - 0:30",
      visualAction: "Executive PDF and standalone offline HTML export showcased, ending with 4.9/5 stars badge and call-to-action glow.",
      onScreenText: "TRY EVENTCRAFT AI FREE 🚀",
      voiceover: "Stop stressing and start crafting. Tap the link to try EventCraft AI 100% free right now!",
      soundEffect: "Uplifting future bass crescendo"
    }
  ],
  socialCaption: `Planning an unforgettable wedding, gala, or summit without losing your sanity? 🥂✨

EventCraft AI replaces 10 chaotic spreadsheets with:
⚡ 1-Click AI Master Blueprints
📈 Predictive Budget Overrun Radar (save $3,200+ on vendor drift)
⏱️ Minute-by-Minute DJ & Coordinator Run Sheets
📱 1-Tap WhatsApp RSVPs with Dietary Breakdown
📄 1-Click Offline Standalone HTML & PDF Export

Try it 100% free right now — link in bio! 🚀

#eventplanner #weddingplanner #ai #tech #eventplanning #weddingtech #productivity #startups #corporategala #partysuccess #saas`,
  musicStyle: "Upbeat Lo-Fi Future Bass (124 BPM) with punchy sidechain kicks"
};

interface MarketingReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const MarketingReelModal: React.FC<MarketingReelModalProps> = ({
  isOpen,
  onClose,
  onToast
}) => {
  const [reel, setReel] = useState<ReelData>(DEFAULT_REEL);
  const [activeTab, setActiveTab] = useState<'player' | 'script' | 'social' | 'ai-generator'>('player');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // AI Generator Form
  const [aiNiche, setAiNiche] = useState('Luxury Destination Wedding');
  const [aiTone, setAiTone] = useState('High Energy & Viral');
  const [aiDuration, setAiDuration] = useState(30);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Web Audio Synth references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<number | null>(null);

  // Scene timing configuration (each scene lasts 5 seconds at 1x)
  const SCENE_DURATION_MS = 5000;
  const [sceneProgress, setSceneProgress] = useState(0);

  // Web Audio Synthesizer: Ambient upbeat lo-fi groove
  const playBeatTone = (freq: number, type: OscillatorType, duration: number, gainVal: number) => {
    if (!audioCtxRef.current || !soundEnabled) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext fallback
    }
  };

  // Start sound loop
  useEffect(() => {
    if (soundEnabled && isPlaying) {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }

      const chordFrequencies = [
        [261.63, 329.63, 392.0, 523.25], // C major
        [220.0, 261.63, 329.63, 440.0],  // A minor
        [174.61, 220.0, 261.63, 349.23], // F major
        [196.0, 246.94, 293.66, 392.0]   // G major
      ];

      let beatStep = 0;
      const interval = setInterval(() => {
        if (!soundEnabled || !isPlaying) return;
        beatStep++;
        // Kick on 1 and 3
        if (beatStep % 4 === 1 || beatStep % 4 === 3) {
          playBeatTone(80, 'sine', 0.2, 0.25);
        }
        // Snare/Hat on 2 and 4
        if (beatStep % 4 === 2 || beatStep % 4 === 0) {
          playBeatTone(1800, 'triangle', 0.08, 0.06);
        }
        // Chord arpeggio on downbeat
        if (beatStep % 4 === 1) {
          const chord = chordFrequencies[(currentSceneIdx) % chordFrequencies.length];
          chord.forEach((freq, i) => {
            setTimeout(() => {
              playBeatTone(freq, 'sine', 0.4, 0.08);
            }, i * 60);
          });
        }
      }, 350 / playbackSpeed);

      synthTimerRef.current = interval as unknown as number;

      return () => {
        clearInterval(interval);
      };
    } else {
      if (synthTimerRef.current) {
        clearInterval(synthTimerRef.current);
      }
    }
  }, [soundEnabled, isPlaying, currentSceneIdx, playbackSpeed]);

  // Main playback loop
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const intervalMs = 50;
    const increment = (intervalMs / (SCENE_DURATION_MS / playbackSpeed)) * 100;

    const timer = setInterval(() => {
      setSceneProgress((prev) => {
        if (prev >= 100) {
          // Advance to next scene
          setCurrentSceneIdx((curr) => {
            if (curr < reel.scenes.length - 1) {
              return curr + 1;
            } else {
              return 0; // loop
            }
          });
          return 0;
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, playbackSpeed, reel.scenes.length]);

  if (!isOpen) return null;

  const currentScene = reel.scenes[currentSceneIdx] || reel.scenes[0];

  const handleNextScene = () => {
    setCurrentSceneIdx((prev) => (prev < reel.scenes.length - 1 ? prev + 1 : 0));
    setSceneProgress(0);
  };

  const handlePrevScene = () => {
    setCurrentSceneIdx((prev) => (prev > 0 ? prev - 1 : reel.scenes.length - 1));
    setSceneProgress(0);
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    onToast(`Copied ${type} to clipboard!`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleGenerateCustomReel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/reel-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: aiNiche,
          tone: aiTone,
          durationSeconds: aiDuration
        })
      });
      const data = await res.json();
      if (data.success && data.reel) {
        setReel(data.reel);
        setCurrentSceneIdx(0);
        setSceneProgress(0);
        setActiveTab('player');
        onToast('✨ New custom AI marketing reel generated!');
      }
    } catch {
      onToast('Error generating AI reel script');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col lg:flex-row w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900 text-slate-100 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
          aria-label="Close marketing reel modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* LEFT / CENTER: Reel Screen Player */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-950/70 border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Aspect Ratio Switcher & Controls */}
          <div className="flex items-center justify-between w-full max-w-sm mb-3">
            <div className="flex items-center gap-1.5 bg-slate-800/90 rounded-xl p-1 border border-slate-700 text-xs">
              <button
                onClick={() => setAspectRatio('9:16')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  aspectRatio === '9:16' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="9:16 Vertical Reel (Instagram / TikTok)"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>9:16 Reel</span>
              </button>
              <button
                onClick={() => setAspectRatio('1:1')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  aspectRatio === '1:1' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="1:1 Square Feed"
              >
                <Square className="h-3.5 w-3.5" />
                <span>1:1 Square</span>
              </button>
              <button
                onClick={() => setAspectRatio('16:9')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  aspectRatio === '16:9' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="16:9 Landscape Video"
              >
                <Monitor className="h-3.5 w-3.5" />
                <span>16:9</span>
              </button>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800/90 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Beat Soundtrack"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-[11px]">Audio Beat On</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-[11px]">Unmute Beat</span>
                </>
              )}
            </button>
          </div>

          {/* Phone Frame Container */}
          <div
            className={`relative overflow-hidden rounded-3xl border-4 border-slate-700/80 bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 shadow-2xl transition-all duration-300 flex flex-col justify-between ${
              aspectRatio === '9:16'
                ? 'w-[290px] sm:w-[320px] h-[520px] sm:h-[560px]'
                : aspectRatio === '1:1'
                ? 'w-[320px] sm:w-[420px] h-[320px] sm:h-[420px]'
                : 'w-[320px] sm:w-[500px] h-[260px] sm:h-[310px]'
            }`}
          >
            {/* Top Story / Reel Progress Bar */}
            <div className="absolute top-0 inset-x-0 z-30 p-3 pt-2 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-1.5">
                {reel.scenes.map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentSceneIdx(idx);
                      setSceneProgress(0);
                    }}
                    className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden cursor-pointer"
                  >
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-indigo-400 transition-all duration-75"
                      style={{
                        width:
                          idx < currentSceneIdx
                            ? '100%'
                            : idx === currentSceneIdx
                            ? `${sceneProgress}%`
                            : '0%'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Header Badges inside Reel */}
              <div className="flex items-center justify-between mt-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-tr from-indigo-500 to-pink-500 text-white shadow-sm">
                    <Sparkles className="h-3 w-3" />
                  </div>
                  <span className="font-extrabold tracking-tight text-white text-[11px]">
                    EventCraft <span className="text-pink-400">AI</span>
                  </span>
                  <span className="rounded-full bg-rose-500/80 px-1.5 py-0.2 text-[9px] font-bold text-white uppercase tracking-wider animate-pulse">
                    LIVE REEL
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-300">
                  {currentScene.timeCode}
                </span>
              </div>
            </div>

            {/* MAIN DYNAMIC SCENE CANVAS */}
            <div className="relative flex-1 flex flex-col justify-center items-center p-6 text-center z-10 overflow-hidden">
              {/* Scene 1: Chaotic Spreadsheets */}
              {currentSceneIdx === 0 && (
                <div className="space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-xs font-bold text-rose-300">
                    <Flame className="h-3.5 w-3.5 text-rose-400 animate-bounce" />
                    <span>THE EVENT CHAOS</span>
                  </div>
                  <div className="relative mx-auto w-56 p-3 rounded-xl bg-slate-900/90 border border-rose-500/30 shadow-xl text-left font-mono text-[11px]">
                    <div className="text-rose-400 font-bold mb-1">⚠️ SPREADSHEET_DEFICIT</div>
                    <div className="text-slate-400 line-through">Decor Budget: ₹1,50,000</div>
                    <div className="text-rose-300 font-bold">Actual Invoice: ₹2,40,000 🔴</div>
                    <div className="text-amber-300 text-[10px] mt-1">Caterer: NO CONTRACT CONFIRMED</div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    Stop Planning with <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300">
                      10 Messy Spreadsheets!
                    </span>
                  </h3>
                </div>
              )}

              {/* Scene 2: 1-Click AI Blueprint */}
              {currentSceneIdx === 1 && (
                <div className="space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 px-3 py-1 text-xs font-bold text-indigo-300">
                    <Zap className="h-3.5 w-3.5 text-indigo-400" />
                    <span>ONE-CLICK ENGINE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-left w-64 mx-auto">
                    <div className="rounded-xl bg-indigo-950/60 border border-indigo-500/30 p-2.5">
                      <div className="text-[10px] text-indigo-300 font-semibold">Budget Split</div>
                      <div className="text-base font-extrabold text-white">8 Categories</div>
                    </div>
                    <div className="rounded-xl bg-pink-950/60 border border-pink-500/30 p-2.5">
                      <div className="text-[10px] text-pink-300 font-semibold">Timeline</div>
                      <div className="text-base font-extrabold text-white">16 Weeks</div>
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    Complete Master Plan in <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                      3.4 Seconds Flat
                    </span>
                  </h3>
                </div>
              )}

              {/* Scene 3: Predictive Budget Overrun Radar */}
              {currentSceneIdx === 2 && (
                <div className="space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    <span>PREDICTIVE RADAR</span>
                  </div>
                  <div className="mx-auto w-60 p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-left">
                    <div className="flex justify-between items-center text-[10px] text-slate-300 mb-1">
                      <span>Live Forecast Model</span>
                      <span className="font-bold text-emerald-400">Trend-Weighted</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 w-4/5 animate-pulse" />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-300">Projected Savings:</span>
                      <span className="text-emerald-400">+₹45,000 Safe</span>
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    Catch Cost Drift <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
                      Before You Spend
                    </span>
                  </h3>
                </div>
              )}

              {/* Scene 4: Minute-by-Minute Run Sheet */}
              {currentSceneIdx === 3 && (
                <div className="space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-300">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span>DAY-OF RUN SHEET</span>
                  </div>
                  <div className="space-y-1.5 w-60 mx-auto text-left font-mono text-[10px]">
                    <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex justify-between">
                      <span className="text-amber-300">09:30 AM</span>
                      <span className="text-white truncate">Soundcheck & DJ Line-Check</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex justify-between">
                      <span className="text-indigo-300">11:30 AM</span>
                      <span className="text-white truncate">Guest Welcome Refreshments</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex justify-between">
                      <span className="text-pink-300">01:00 PM</span>
                      <span className="text-white truncate">Ceremony Stage Entrance</span>
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    Minute-by-Minute <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-pink-400">
                      Zero-Glitch Coordination
                    </span>
                  </h3>
                </div>
              )}

              {/* Scene 5: 1-Tap WhatsApp Invites & Dietary Radar */}
              {currentSceneIdx === 4 && (
                <div className="space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="inline-flex items-center gap-1 rounded-full bg-teal-500/20 border border-teal-500/40 px-3 py-1 text-xs font-bold text-teal-300">
                    <MessageCircle className="h-3.5 w-3.5 text-teal-400" />
                    <span>WHATSAPP RSVP</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-left w-64 mx-auto text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-300 mb-1">
                      <Send className="h-3 w-3" />
                      <span>WhatsApp Invitation Sent</span>
                    </div>
                    <p className="text-slate-200 text-[10px]">"You are warmly invited to celebrate with us! Tap here to RSVP..."</p>
                    <div className="mt-2 flex gap-1 text-[9px] font-mono">
                      <span className="bg-emerald-900/80 px-1.5 py-0.5 rounded text-emerald-200">Veg: 68</span>
                      <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">Non-Veg: 42</span>
                      <span className="bg-amber-900/80 px-1.5 py-0.5 rounded text-amber-200">Jain: 15</span>
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    1-Tap Invites <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300">
                      Zero App Downloads
                    </span>
                  </h3>
                </div>
              )}

              {/* Scene 6: Call To Action Finale */}
              {currentSceneIdx === 5 && (
                <div className="space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-center gap-1 text-amber-400">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400" />
                    <span className="text-xs font-bold text-slate-200 ml-1">4.9 / 5</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Your Dream Event, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-indigo-300 to-emerald-300">
                      Engineered to Perfection
                    </span>
                  </h3>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 px-5 py-2 text-xs font-extrabold text-white shadow-lg shadow-indigo-500/30 animate-pulse">
                    <span>Try EventCraft AI Free</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-[11px] text-slate-400">Offline-Ready HTML • Export PDF</p>
                </div>
              )}

              {/* Kinetic Captions Subtitle Overlay */}
              {showCaptions && (
                <div className="absolute bottom-12 inset-x-4 z-20">
                  <div className="inline-block rounded-xl bg-black/85 backdrop-blur-md px-3 py-1.5 border border-white/10 shadow-lg">
                    <p className="text-xs sm:text-sm font-black text-yellow-300 tracking-wide uppercase drop-shadow">
                      {currentScene.onScreenText}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Reel Player Bar */}
            <div className="relative z-30 p-3 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause Reel' : 'Play Reel'}
                >
                  {isPlaying ? <Pause className="h-4 w-4 fill-slate-900" /> : <Play className="h-4 w-4 fill-slate-900 ml-0.5" />}
                </button>
                <button
                  onClick={handlePrevScene}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
                  title="Previous scene"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNextScene}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
                  title="Next scene"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Speed & Caption toggles */}
              <div className="flex items-center gap-1.5 text-[11px]">
                <button
                  onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1))}
                  className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white font-mono cursor-pointer"
                  title="Change playback speed"
                >
                  {playbackSpeed}x
                </button>
                <button
                  onClick={() => setShowCaptions(!showCaptions)}
                  className={`px-2 py-1 rounded font-medium cursor-pointer ${
                    showCaptions ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                  title="Toggle subtitles"
                >
                  CC
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Marketing Reel Kit & Script Studio */}
        <div className="w-full lg:w-[480px] flex flex-col h-[520px] lg:h-[620px] bg-slate-900">
          {/* Tabs Header */}
          <div className="flex items-center border-b border-slate-800 p-2 gap-1 bg-slate-900/90 text-xs">
            <button
              onClick={() => setActiveTab('player')}
              className={`flex-1 py-2 px-2.5 rounded-lg font-bold text-center transition-colors cursor-pointer ${
                activeTab === 'player' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              🎬 Scene Details
            </button>
            <button
              onClick={() => setActiveTab('script')}
              className={`flex-1 py-2 px-2.5 rounded-lg font-bold text-center transition-colors cursor-pointer ${
                activeTab === 'script' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              🎙️ Full Script
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`flex-1 py-2 px-2.5 rounded-lg font-bold text-center transition-colors cursor-pointer ${
                activeTab === 'social' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              📱 Viral Caption
            </button>
            <button
              onClick={() => setActiveTab('ai-generator')}
              className={`flex-1 py-2 px-2.5 rounded-lg font-bold text-center transition-colors cursor-pointer ${
                activeTab === 'ai-generator' ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white' : 'text-pink-400 hover:bg-slate-800'
              }`}
            >
              ✨ AI Studio
            </button>
          </div>

          {/* TAB 1: SCENE DETAILS */}
          {activeTab === 'player' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">
                  Scene {currentScene.sceneNumber} of {reel.scenes.length}
                </span>
                <span className="font-mono text-indigo-400 font-semibold">{currentScene.timeCode}</span>
              </div>

              {/* On-Screen Text */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kinetic Typography</div>
                <div className="text-sm font-extrabold text-amber-300">{currentScene.onScreenText}</div>
              </div>

              {/* Spoken Narration */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Voiceover Line</div>
                <p className="text-slate-200 leading-relaxed font-medium text-xs">"{currentScene.voiceover}"</p>
              </div>

              {/* Visual Action */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Visual Screen Action</div>
                <p className="text-slate-300 leading-relaxed">{currentScene.visualAction}</p>
              </div>

              {/* Sound Design Cue */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sound Design & SFX</div>
                <div className="flex items-center gap-1.5 text-indigo-300">
                  <Music className="h-3.5 w-3.5" />
                  <span>{currentScene.soundEffect}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => handleCopy(currentScene.voiceover, 'Scene Voiceover')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Scene Voiceover</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FULL SCRIPT */}
          {activeTab === 'script' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{reel.title}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Hook: "{reel.hook}"</p>
                </div>
                <button
                  onClick={() => {
                    const fullText = reel.scenes
                      .map((s) => `[${s.timeCode}] (${s.onScreenText})\nVOICEOVER: ${s.voiceover}\nSFX: ${s.soundEffect}\nVISUAL: ${s.visualAction}\n`)
                      .join('\n---\n\n');
                    handleCopy(fullText, 'Complete Production Script');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 cursor-pointer"
                >
                  {copiedType === 'Complete Production Script' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>Copy All</span>
                </button>
              </div>

              <div className="space-y-3">
                {reel.scenes.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentSceneIdx(idx);
                      setSceneProgress(0);
                      setActiveTab('player');
                    }}
                    className={`rounded-xl border p-3.5 space-y-1.5 cursor-pointer transition-colors ${
                      idx === currentSceneIdx
                        ? 'border-indigo-500/80 bg-indigo-950/30'
                        : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400">
                        Scene {s.sceneNumber} • {s.timeCode}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{s.onScreenText}</span>
                    </div>
                    <p className="text-slate-200 text-xs font-medium">"{s.voiceover}"</p>
                    <p className="text-slate-400 text-[11px]">🎬 {s.visualAction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VIRAL SOCIAL CAPTION */}
          {activeTab === 'social' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Post Caption & Hashtags</h4>
                  <p className="text-slate-400 text-[11px]">Optimized for Instagram Reels, TikTok & LinkedIn</p>
                </div>
                <button
                  onClick={() => handleCopy(reel.socialCaption, 'Social Caption')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 cursor-pointer"
                >
                  {copiedType === 'Social Caption' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>Copy Caption</span>
                </button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 font-sans whitespace-pre-line text-slate-200 leading-relaxed text-xs">
                {reel.socialCaption}
              </div>

              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-3.5 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Recommended Audio Beat</div>
                <div className="text-slate-200 font-medium">{reel.musicStyle}</div>
              </div>
            </div>
          )}

          {/* TAB 4: AI STUDIO SCRIPT GENERATOR */}
          {activeTab === 'ai-generator' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-pink-400" />
                  <span>Gemini Viral Reel Generator</span>
                </h4>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Generate tailor-made viral video scripts for any celebration or event audience.
                </p>
              </div>

              <form onSubmit={handleGenerateCustomReel} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Event Niche / Focus</label>
                  <input
                    type="text"
                    value={aiNiche}
                    onChange={(e) => setAiNiche(e.target.value)}
                    placeholder="e.g. Royal Destination Wedding, Tech Summit, 50th Golden Anniversary"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Tone & Style</label>
                    <select
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="High Energy & Viral">🔥 High Energy & Viral</option>
                      <option value="Luxury & Elegant">✨ Luxury & Sophisticated</option>
                      <option value="Humorous & Relatable">😂 Humorous & Relatable</option>
                      <option value="Executive & Direct">💼 Executive & Direct</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Duration</label>
                    <select
                      value={aiDuration}
                      onChange={(e) => setAiDuration(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value={30}>30 Seconds (Standard)</option>
                      <option value={45}>45 Seconds (Extended)</option>
                      <option value={60}>60 Seconds (Deep Dive)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingAi}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 py-2.5 font-bold text-white shadow-lg shadow-pink-500/20 hover:from-pink-500 hover:to-indigo-500 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isGeneratingAi ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Writing Viral Script with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate Bespoke Marketing Reel</span>
                    </>
                  )}
                </button>
              </form>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-slate-300">Creator Tip:</span>
                <p>
                  Use the 9:16 aspect ratio with the audio synth unmuted to record screen captures directly on your phone or OBS Studio for instant posting to Instagram Reels and TikTok!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
