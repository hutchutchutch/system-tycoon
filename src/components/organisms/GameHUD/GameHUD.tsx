import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { getUnreadEmailCount } from '../../../services/emailService';
import { signOut } from '../../../features/auth/authSlice';

export const GameHUD = ({ className = '' }: { className?: string }) => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(s => s.auth.profile);
  const mission = useAppSelector(s => s.mission.currentMission);
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const refresh = () => { void getUnreadEmailCount().then(n => { if (!cancelled) setUnread(n); }); };
    refresh(); const timer = setInterval(refresh, 30000);
    window.triggerEmailNotification = refresh;
    return () => { cancelled = true; clearInterval(timer); delete window.triggerEmailNotification; };
  }, []);
  if (!profile) return null;
  return <header className={className} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20,
    minHeight: 64, padding: '8px 20px', borderBottom: '1px solid #64748b55', color: 'var(--color-text-primary)', background: 'var(--color-surface-primary)' }}>
    <Link to="/game" style={{ fontWeight: 700 }}>Service as a Software</Link>
    <nav aria-label="Game navigation" style={{ display: 'flex', gap: 20 }}>
      <Link to="/game" style={{ padding: '12px 0' }}>Campaign</Link>
      <Link to="/email" style={{ padding: '12px 0' }}>Inbox{unread > 0 ? ` (${unread})` : ''}</Link>
      <Link to="/whiteboard" style={{ padding: '12px 0' }}>Practice</Link>
    </nav>
    {mission && <span style={{ fontSize: 13 }}>Stage {mission.currentStageIndex + 1}/{mission.stages.length}</span>}
    <span style={{ marginLeft: 'auto', fontSize: 13 }}>{profile.username} · Level {profile.current_level ?? 1} · {profile.reputation_score ?? 0} Impact</span>
    <button onClick={() => void dispatch(signOut())} style={{ minHeight: 44, padding: '8px 12px' }}>Sign out</button>
  </header>;
};
