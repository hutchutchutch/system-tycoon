import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/cloudflareApi';

interface CampaignRow {
  id: string; title: string; status: string | null; current_stage_id: string | null;
  stage_id: string; stage_number: number; stage_title: string; completed: number;
}
export function CampaignProgress({ refreshKey = 0 }: { refreshKey?: number }) {
  const [rows, setRows] = useState<CampaignRow[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    void api.get<CampaignRow[]>('/missions/campaign/progress').then(data => { if (!cancelled) setRows(data); })
      .catch(() => { if (!cancelled) setError('Campaign progress could not be loaded. Reload to retry.'); });
    return () => { cancelled = true; };
  }, [refreshKey]);
  const missions = [...new Set(rows.map(r => r.id))].map(id => rows.filter(r => r.id === id));
  return <section aria-label="Your campaign progress" style={{ padding: 20, border: '1px solid #64748b66', borderRadius: 10, background: 'var(--color-surface-primary)' }}>
    <h2 style={{ fontSize: 22, marginBottom: 12 }}>Your campaign</h2>
    <p style={{ fontSize: 14, marginBottom: 16 }}>Five stories, five stages each. Contact a client below to begin. Earn a player level every 250 Impact; components unlock as each story progresses.</p>
    {error && <p role="alert">{error}</p>}
    {missions.map(stages => {
      const mission = stages[0];
      const completed = stages.filter(s => s.completed).length;
      return <details key={mission.id} style={{ padding: '12px 0', borderTop: '1px solid #64748b55' }} open={mission.status === 'in_progress'}>
        <summary style={{ cursor: 'pointer', minHeight: 44 }}>{mission.title} · {completed}/{stages.length} complete</summary>
        {mission.status === 'in_progress' && <Link style={{ display: 'inline-block', padding: '12px 0', textDecoration: 'underline' }} to={`/whiteboard/stage/${mission.current_stage_id}`}>Continue current stage →</Link>}
        <ol>{stages.map(stage => <li key={stage.stage_id} style={{ padding: '8px 0' }}>
          {stage.stage_number}. {stage.stage_title} · {stage.completed ? <Link to={`/whiteboard/stage/${stage.stage_id}`}>Review saved design</Link>
            : mission.status === 'in_progress' && stage.stage_id === mission.current_stage_id ? <Link to={`/whiteboard/stage/${stage.stage_id}`}>Ready to continue</Link> : 'Locked'}
        </li>)}</ol>
      </details>;
    })}
  </section>;
}
