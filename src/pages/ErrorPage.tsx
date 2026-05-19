import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';

export const ErrorPage: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let status = 500;
  let title = 'Something went wrong';
  let message = 'An unexpected error occurred. Please try again.';

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (status === 404) {
      title = 'Page not found';
      message = "We couldn't find what you were looking for.";
    } else {
      message = error.data ?? error.statusText;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      background: '#0d1117',
      color: '#e6edf3',
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '4rem', fontWeight: 700, color: '#30363d' }}>{status}</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>{title}</h1>
      <p style={{ color: '#8b949e', maxWidth: '40ch', margin: 0 }}>{message}</p>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '6px',
            border: '1px solid #30363d',
            background: 'transparent',
            color: '#e6edf3',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          Go back
        </button>
        <button
          onClick={() => navigate('/game')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '6px',
            border: 'none',
            background: '#1f6feb',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          Go to home
        </button>
      </div>
    </div>
  );
};
