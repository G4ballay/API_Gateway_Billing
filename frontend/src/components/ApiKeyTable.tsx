import React from 'react';
import type { ApiKey } from '../types/index.ts';

interface ApiKeyTableProps {
  keys: ApiKey[];
  onRevoke: (id: string) => void;
}

export const ApiKeyTable: React.FC<ApiKeyTableProps> = ({ keys, onRevoke }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Prefijo</th>
              <th className="px-6 py-4">Límite</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Creada</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {keys.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No tienes API Keys generadas. Crea una para comenzar a usar el Gateway.
                </td>
              </tr>
            ) : (
              keys.map((key) => (
                <tr key={key._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{key.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{key.keyPrefix}...</td>
                  <td className="px-6 py-4 text-xs text-slate-400">{key.rateLimitPerMin} req/min</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        key.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {key.status === 'active' ? 'Activa' : 'Revocada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(key.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {key.status === 'active' && (
                      <button
                        onClick={() => onRevoke(key._id)}
                        className="text-xs text-rose-400 hover:text-rose-300 transition-colors font-medium"
                      >
                        Revocar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};