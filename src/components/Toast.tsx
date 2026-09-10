import React from 'react';
import { useCommand } from '../context/CommandContext';
import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useCommand();

  if (!toast) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-3.5 border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 max-w-md bg-white/95 dark:bg-slate-900/95 ${
      toast.type === 'critical'
        ? 'border-red-200 dark:border-red-800 border-l-4 border-l-red-600 text-slate-900 dark:text-white'
        : toast.type === 'alert'
        ? 'border-amber-200 dark:border-amber-800 border-l-4 border-l-amber-500 text-slate-900 dark:text-white'
        : 'border-emerald-200 dark:border-emerald-800 border-l-4 border-l-emerald-600 text-slate-900 dark:text-white'
    }`}>
      {toast.type === 'critical' && <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 animate-bounce" />}
      {toast.type === 'alert' && <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0" />}
      {toast.type === 'safe' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />}

      <div className="flex flex-col min-w-0">
        <div className="text-xs font-black text-slate-900 dark:text-white tracking-wide truncate">
          {toast.title}
        </div>
        <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight mt-0.5 break-words">
          {toast.body}
        </div>
      </div>
    </div>
  );
};

