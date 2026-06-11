import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Circle, Mail, Sparkles, ArrowLeft, Newspaper } from 'lucide-react';
import { api } from '../../services/cloudflareApi';
import { useAppDispatch } from '../../hooks/redux';
import { checkAuth } from '../../features/auth/authSlice';
import type { CompleteStageResponse } from '../../services/missionService';
import styles from './MissionResultsPage.module.css';

interface ResultsLocationState {
  completion: CompleteStageResponse;
  context: {
    emailId: string | null;
    stageTitle: string | null;
    missionTitle: string | null;
  };
}

/**
 * Results screen for the email-driven mission flow.
 * Rendered after POST /missions/complete-stage succeeds; the whiteboard
 * passes the full completion payload via router state. On a refresh or
 * deep link the payload is gone, so we fall back to a minimal screen
 * that points the user back at their inbox.
 */
export const MissionResultsPage: React.FC = () => {
  const { stageId } = useParams<{ stageId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const state = (location.state ?? null) as ResultsLocationState | null;

  const [fallbackTitle, setFallbackTitle] = useState<string | null>(null);

  // The server just awarded Impact — refresh the profile so the GameHUD
  // total matches the number on this screen.
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // No completion payload (refresh / deep link) — fetch the stage title
  // for context, but detailed results only exist right after completion.
  useEffect(() => {
    if (state || !stageId) return;
    api
      .get<{ title: string; mission: { title: string } }>(`/missions/stage/${stageId}`)
      .then((stage) => setFallbackTitle(stage?.mission?.title ?? stage?.title ?? null))
      .catch(() => setFallbackTitle(null));
  }, [state, stageId]);

  if (!state) {
    return (
      <div className={styles.page}>
        <div className={styles.fallbackCard}>
          <h1 className={styles.fallbackTitle}>Results</h1>
          {fallbackTitle && <p className={styles.fallbackContext}>{fallbackTitle}</p>}
          <p className={styles.fallbackText}>
            Detailed results are shown right after you complete a stage.
            Check your email for the next brief from your client.
          </p>
          <div className={styles.actions}>
            <button onClick={() => navigate('/email')} className={styles.btnPrimary}>
              <Mail size={18} /> Check Your Email
            </button>
            <button onClick={() => navigate('/browser/news')} className={styles.btnSecondary}>
              <Newspaper size={18} /> Find Missions
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { completion, context } = state;
  const { validation, missionCompleted, firstCompletion, pointsEarned, impactTotal, deliveredEmails } = completion;
  const visibleRequirements = validation.requirements.filter((r) => r.visible);
  const newEmail = deliveredEmails[0] ?? null;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Sparkles size={28} />
            <h1>{missionCompleted ? 'Mission Complete!' : 'Stage Complete!'}</h1>
            <Sparkles size={28} />
          </div>
          {context.missionTitle && (
            <p className={styles.subtitle}>
              {context.missionTitle}
              {context.stageTitle ? ` — ${context.stageTitle}` : ''}
            </p>
          )}
        </div>

        {/* Impact */}
        <div className={styles.impact}>
          <p className={styles.impactPoints}>+{pointsEarned}</p>
          <p className={styles.impactLabel}>Impact earned</p>
          {typeof impactTotal === 'number' && (
            <p className={styles.impactTotal}>
              Total Impact: <strong>{impactTotal}</strong>
            </p>
          )}
          {!firstCompletion && (
            <p className={styles.impactRepeat}>
              You already completed this stage — no new Impact awarded.
            </p>
          )}
        </div>

        {/* Requirements checklist */}
        <div className={styles.requirementsBox}>
          <h2 className={styles.requirementsTitle}>
            Requirements
            <span className={styles.requirementsCount}>
              {validation.summary.completedRequirements}/{validation.summary.totalRequirements}
            </span>
          </h2>
          <ul className={styles.reqList}>
            {visibleRequirements.map((req) => (
              <li key={req.id} className={styles.reqItem}>
                {req.completed ? (
                  <CheckCircle size={20} className={styles.reqIconDone} />
                ) : (
                  <Circle size={20} className={styles.reqIconPending} />
                )}
                <div>
                  <p className={styles.reqText}>{req.title || req.description}</p>
                  {req.points > 0 && <p className={styles.reqPoints}>+{req.points} Impact</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* New email notification */}
        {newEmail && (
          <button onClick={() => navigate('/email')} className={styles.emailCard}>
            <div className={styles.emailCardInner}>
              <Mail size={22} className={styles.emailIcon} />
              <div style={{ minWidth: 0 }}>
                <p className={styles.emailFrom}>New message from {newEmail.sender_name}</p>
                <p className={styles.emailSubject}>{newEmail.subject}</p>
              </div>
            </div>
          </button>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          {missionCompleted ? (
            <>
              <button onClick={() => navigate('/browser/news')} className={styles.btnSuccess}>
                <Newspaper size={18} /> Find More Missions
              </button>
              <button onClick={() => navigate('/email')} className={styles.btnSecondary}>
                <Mail size={18} /> Inbox
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/email')} className={styles.btnPrimary}>
              <Mail size={18} /> Check Your Email
            </button>
          )}
          {context.emailId && (
            <button
              onClick={() => navigate(`/whiteboard/${context.emailId}`)}
              className={styles.btnSecondary}
            >
              <ArrowLeft size={18} /> Back to Whiteboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
