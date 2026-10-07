import React, { useState } from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { fetchWithAuth } from './services/api';

export const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isRegistering ? '/auth/register' : '/auth/login';

    try {
      const data = await fetchWithAuth(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            {isRegistering ? 'Crear Cuenta' : 'Inicia Sesión'}
          </h1>
          <p className="text-sm text-slate-400 text-center mb-6">
            {isRegistering
              ? 'Regístrate para obtener 100 créditos de prueba'
              : 'Ingresa a tu panel para gestionar tus API Keys'}
          </p>

          {error && (
            <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-red-500 text-sm"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-red-500 text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50 mt-2"
            >
              {loading
                ? 'Procesando...'
                : isRegistering
                ? 'Registrarse y Comenzar'
                : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors underline"
            >
              {isRegistering
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿No tienes cuenta? Regístrate aquí'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleLogout}
        className="fixed top-6 right-6 z-40 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors border border-slate-700"
      >
        Cerrar Sesión
      </button>
      <DashboardPage />
    </div>
  );
};

export default App;
