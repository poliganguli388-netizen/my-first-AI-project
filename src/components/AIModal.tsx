import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'invite' | 'budget' | 'vendor' | 'generic';
  data: any;
  onToast: (msg: string) => void;
}

export const AIModal: React.FC<AIModalProps> = ({
  isOpen,
  onClose,
  title,
  type,
  data,
  onToast
}) => {
  const [copied, setCopied] = useState(false);
  const [activeInviteTab, setActiveInviteTab] = useState<'whatsapp' | 'email' | 'sms'>('whatsapp');

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onToast('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[88vh] rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 dark:text-slate-300">
          {type === 'invite' && data && (
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  onClick={() => setActiveInviteTab('whatsapp')}
                  className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                    activeInviteTab === 'whatsapp'
                      ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  📱 WhatsApp Message
                </button>
                <button
                  onClick={() => setActiveInviteTab('email')}
                  className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                    activeInviteTab === 'email'
                      ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  ✉️ Formal Email
                </button>
                <button
                  onClick={() => setActiveInviteTab('sms')}
                  className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                    activeInviteTab === 'sms'
                      ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  💬 Quick SMS Reminder
                </button>
              </div>

              {/* Invitation Text Box */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-normal whitespace-pre-wrap leading-relaxed dark:border-slate-800 dark:bg-slate-800/60 select-all">
                {activeInviteTab === 'whatsapp'
                  ? data.whatsapp
                  : activeInviteTab === 'email'
                  ? data.email
                  : data.sms}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                {activeInviteTab === 'whatsapp' && (
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(data.whatsapp || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Launch in WhatsApp</span>
                  </a>
                )}
                <button
                  onClick={() =>
                    handleCopy(
                      activeInviteTab === 'whatsapp'
                        ? data.whatsapp
                        : activeInviteTab === 'email'
                        ? data.email
                        : data.sms
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
              </div>
            </div>
          )}

          {type === 'budget' && data && (
            <div className="space-y-4">
              {data.healthAssessment && (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 text-xs leading-relaxed font-medium text-indigo-900 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200">
                  {data.healthAssessment}
                </div>
              )}

              {data.topSavingsTips && data.topSavingsTips.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm mb-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>Top Cost-Saving Strategies</span>
                  </h4>
                  <ul className="space-y-2 text-xs pl-2">
                    {data.topSavingsTips.map((tip: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.hiddenCostsToWatch && data.hiddenCostsToWatch.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 text-sm mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Hidden Vendor Surcharges to Watch Out For</span>
                  </h4>
                  <ul className="space-y-2 text-xs pl-2">
                    {data.hiddenCostsToWatch.map((cost: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-bold text-rose-500 mt-0.5">•</span>
                        <span>{cost}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.rebalancingRecommendations && (
                <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <b>Reserve Buffer Recommendation:</b> {data.rebalancingRecommendations}
                </div>
              )}
            </div>
          )}

          {type === 'vendor' && data && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Essential questions and red flag clauses to negotiate before signing vendor deposits:
              </p>

              {data.categories &&
                data.categories.map((cat: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mb-2">
                      {cat.category}
                    </h4>

                    <div className="space-y-1.5 mb-3">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                        Must-Ask Interview Questions:
                      </div>
                      <ul className="space-y-1 pl-2 text-xs text-slate-700 dark:text-slate-300">
                        {cat.questions.map((q: string, qIdx: number) => (
                          <li key={qIdx} className="flex items-start gap-1.5">
                            <span className="text-indigo-500 font-bold">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {cat.contractRedFlags && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                        <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider dark:text-rose-400">
                          Contract Red Flags to Strike:
                        </div>
                        <ul className="space-y-1 pl-2 text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {cat.contractRedFlags.map((rf: string, rIdx: number) => (
                            <li key={rIdx} className="flex items-start gap-1.5">
                              <span className="text-rose-500 font-bold">⚠️</span>
                              <span>{rf}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {type === 'generic' && (
            <div className="whitespace-pre-wrap leading-relaxed text-xs">
              {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
