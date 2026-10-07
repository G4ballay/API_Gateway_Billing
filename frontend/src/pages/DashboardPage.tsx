import React, { useEffect, useState } from 'react';
import type { ApiKey, UserProfile, CreateKeyResponse } from '../types';
import { fetchWithAuth } from '../services/api';
import { CreditStats } from '../components/CreditStats';
import { ApiKeyTable } from '../components/ApiKeyTable';
import { CreateKeyModal } from '../components/CreateKeyModal';

export const DashboardPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      const [profileData, keysData] = await Promise.all([
        fetchWithAuth('/users/me'),
        fetchWithAuth('/keys')
      ]);
      setProfile(profileData);
      setKeys(keysData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateKey = async (name: string): Promise<string | null> => {
    try {
      const res: CreateKeyResponse = await fetchWithAuth('/keys', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });

      setKeys((prev) => [res.keyInfo, ...prev]);
      return res.apiKey;
    } catch (err: any) {
      alert(err.message || 'No se pudo crear la clave');
      return null;
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm('¿Estás seguro de revocar esta API Key? Esta acción es irreversible.')) return;

    try {
      await fetchWithAuth(`/keys/${id}/revoke`, { method: 'PATCH' });
      setKeys((prev) =>
        prev.map((k) => (k._id === id ? { ...k, status: 'revoked' } : k))
      );
    } catch (err: any) {
      alert(err.message || 'Error al revocar la clave');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Panel de Desarrollador</h1>
            <p className="text-sm text-slate-400">{profile?.email}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium text-sm rounded-lg transition-colors shadow-lg shadow-red-900/20 self-start sm:self-auto"
          >
            + Crear API Key
          </button>
        </header>

        {error && (
          <div className="p-4 mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <CreditStats
          credits={profile?.credits ?? 0}
          activeKeysCount={keys.filter((k) => k.status === 'active').length}
        />

        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Claves de API</h2>
          <ApiKeyTable keys={keys} onRevoke={handleRevokeKey} />
        </section>

        <CreateKeyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateKey}
        />
      </div>
    </div>
  );
};