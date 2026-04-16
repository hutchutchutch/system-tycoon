import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authClient } from '../../services/cloudflareApi';

/**
 * Shown right after signup. Better Auth has already sent the verification
 * email via our SendGrid callback. User clicks the link in their inbox to
 * verify and activate their account.
 */
export const VerifyEmailSentPage: React.FC = () => {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;
  const [resent, setResent] = React.useState(false);
  const [resending, setResending] = React.useState(false);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    await authClient.sendVerificationEmail({
      email,
      callbackURL: '/game',
    });
    setResending(false);
    setResent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-gray-300 text-sm mb-6">
          We sent a verification link to {email ? <strong className="text-white">{email}</strong> : 'your email'}.
          Click it to activate your account.
        </p>

        <div className="text-xs text-gray-400 mb-6">
          Didn't get it? Check your spam folder or{' '}
          {resent ? (
            <span className="text-green-400">resent!</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={!email || resending}
              className="text-blue-400 hover:text-blue-300 underline disabled:opacity-50"
            >
              {resending ? 'sending...' : 'resend the email'}
            </button>
          )}
        </div>

        <Link to="/auth" className="text-sm text-blue-400 hover:text-blue-300">
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
};
