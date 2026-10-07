import React, { useState } from 'react';

interface CreateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<string | null>;
}

export const CreateKeyModal: React.FC<CreateKeyModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const rawKey = await onCreate(name);
    setLoading(false);

    if (rawKey) {
      setGeneratedKey(rawKey);
    }
  };

  const handleCopy = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setName('');
    setGeneratedKey(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        {!generatedKey ? (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold text-white mb-2">Crear nueva API Key</h2>
            <p className="text-sm text-slate-400 mb-4">
              Asigna un nombre descriptivo para identificar en qué entorno o cliente la usarás.
            </p>

            <div className="mb-6">
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                Nombre de la clave
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Producción Web / App Móvil"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-red-500 text-sm"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Generando...' : 'Generar Clave'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">¡API Key Generada!</h2>
            <p className="text-sm text-amber-400 mb-4">
              Copia esta clave ahora. Por motivos de seguridad, <strong>no podrás volver a verla</strong>.
            </p>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between mb-6">
              <code className="text-xs font-mono text-emerald-400 break-all">{generatedKey}</code>
              <button
                onClick={handleCopy}
                className="ml-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded transition-colors shrink-0"
              >
                {copied ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Entendido, ya la guardé
            </button>
          </div>
        )}
      </div>
    </div>
  );
};