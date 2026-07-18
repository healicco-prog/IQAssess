import React from 'react';
import { Lock, Sparkles, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface PremiumLockScreenProps {
  featureName: string;
  featureDescription: string;
  onUnlockPremium: () => void;
}

export const PremiumLockScreen: React.FC<PremiumLockScreenProps> = ({ 
  featureName, 
  featureDescription, 
  onUnlockPremium 
}) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-8 bg-slate-950 text-slate-100 font-sans">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl p-6 md:p-10 shadow-2xl shadow-blue-500/5 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-40 bg-blue-600/10 rounded-full blur-[80px]" />

        {/* Header Locked state indicator */}
        <div className="relative flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Lock size={28} className="animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 flex items-center justify-center">
                <Sparkles size={8} className="text-slate-950" />
              </span>
            </span>
          </div>

          <div className="space-y-1.5 max-w-md">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-black text-amber-400 uppercase tracking-widest">
              Premium Upgrade Required
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white font-sans">
              {featureName} is Locked
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {featureDescription}
            </p>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-8 border-t border-slate-800/60 pt-8">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mb-4">
            Compare License Offerings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard License */}
            <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Standard License</span>
                <span className="text-[9px] bg-slate-800 text-slate-400 font-mono px-1.5 py-0.5 rounded uppercase font-bold">
                  Active (Armstrong)
                </span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li className="flex items-start gap-1.5">
                  <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Essay Builder, MCQ Builder, Rubric Builder (Standard)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Essay AS, Reflection AS (Standard)</span>
                </li>
              </ul>
            </div>

            {/* Premium License */}
            <div className="p-4 bg-blue-950/10 rounded-2xl border border-blue-900/30 space-y-2.5 relative">
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wide animate-pulse">
                <Zap size={8} /> Upgrade Recommended
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400">Premium Institutional Edition</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li className="flex items-start gap-1.5 font-bold">
                  <Check size={12} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>Blueprint Builder & Assessment Builder</span>
                </li>
                <li className="flex items-start gap-1.5 font-bold">
                  <Check size={12} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>Paper AS & MCQ AS</span>
                </li>
                <li className="flex items-start gap-1.5 font-bold">
                  <Check size={12} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>BluePrint Assessor & Item Analysis & Analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="mt-8 flex flex-col items-center space-y-3">
          <button
            onClick={onUnlockPremium}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Switch to Premium (Sarah Jenkins Preset)</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          
          <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
            <ShieldCheck size={11} className="text-blue-500" />
            Seamless role migration. No loss of stored assessment parameters.
          </p>
        </div>
      </div>
    </div>
  );
};
