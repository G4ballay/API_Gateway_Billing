import React from 'react';

interface CreditStatsProps {
  credits: number;
  activeKeysCount: number;
}

export const CreditStats: React.FC<CreditStatsProps> = ({ credits, activeKeysCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-sm">
        <span className="text-sm font-medium text-slate-400">Créditos Disponibles</span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{credits.toLocaleString()}</span>
          <span className="text-xs text-slate-500">créditos restados por uso en Gateway</span>
        </div>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-sm">
        <span className="text-sm font-medium text-slate-400">API Keys Activas</span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-emerald-400">{activeKeysCount}</span>
          <span className="text-xs text-slate-500">claves listas para consumo</span>
        </div>
      </div>
    </div>
  );
};