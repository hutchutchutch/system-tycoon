import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authClient } from '../../services/cloudflareApi';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setStatus('loading');
    setErrorMsg(null);

    const res = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    if (res.error) {
      setStatus('error');
      setErrorMsg(res.error.message || 'Reset failed. The link may have expired.');
      return;
    }

    setStatus('success');
    setTimeout(() => navigate('/auth', { replace: true }), 2500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Choose a new password</h1>
        <p className="text-gray-300 text-sm mb-6">
          Pick something you'll remember — at least 8 characters.
        </p>

        {status === 'success' ? (
          <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-sm text-green-300">
            <p className="font-semibold mb-1">Password updated</p>
            <p className="text-green-200/80">Redirecting you to sign in...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}
            <button
              type="submit"
              disabled={status === 'loading' || !token}
              className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'loading' ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/auth" className="text-sm text-blue-400 hover:text-blue-300">
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
