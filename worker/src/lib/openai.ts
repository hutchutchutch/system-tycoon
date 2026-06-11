/**
 * OpenAI-backed NPC chat generation.
 * Ported from the former Supabase edge function `npc-chat`. Reads mission fields
 * that exist on the D1 `missions` table (enriched in migration 0012).
 */

import type { Env } from '../types';
import { sendEmail, renderEmail } from './email';

/** Shown to players when the OpenAI call fails, so the chat degrades gracefully. */
export const NPC_FALLBACK_REPLY =
  "Thank you so much for your message! I'm having a little trouble responding in detail right now — could you give me a moment and send that again shortly? I really appreciate your patience.";

const OPENAI_ALERT_KEY = 'alert:openai-quota';
const OPENAI_ALERT_TTL_SECONDS = 3600; // rate-limit alerts to once per hour

/**
 * Notify the operator (rate-limited via KV) that NPC chat is degraded and the
 * OpenAI budget likely needs raising. Never throws — alerting must not break the
 * request path.
 */
export async function alertOpenAiFailure(env: Env, detail: string): Promise<void> {
  try {
    if (await env.CACHE.get(OPENAI_ALERT_KEY)) return; // already alerted recently
    await env.CACHE.put(OPENAI_ALERT_KEY, '1', { expirationTtl: OPENAI_ALERT_TTL_SECONDS });

    const { html, text } = renderEmail({
      preheader: 'NPC chat is failing — the OpenAI API key needs attention',
      heading: 'Action needed: increase the OpenAI API budget for saas.game',
      body:
        'The NPC chat Worker could not reach OpenAI and is serving fallback replies to players. ' +
        'The most likely cause is the API key hitting its quota/budget. Please review billing and ' +
        `raise the limit so AI conversations resume.<br><br><strong>Error detail:</strong> ${detail.slice(0, 500)}`,
      ctaLabel: 'Open OpenAI Billing',
      ctaUrl: 'https://platform.openai.com/account/billing/overview',
      footer: 'You are receiving this because you operate saas.game. This alert is rate-limited to once per hour.',
    });

    await sendEmail(env, {
      to: 'hutchenbach@gmail.com',
      subject: '⚠️ saas.game: OpenAI budget needs increasing (NPC chat degraded)',
      html,
      text,
    });
  } catch (err) {
    console.error('Failed to send OpenAI failure alert:', err);
  }
}

export interface NpcPersonality {
  style?: string;
  patience?: string;
  technical_depth?: string;
  backstory?: string;
}

export interface NpcForPrompt {
  name: string;
  handle: string;
  company?: string | null;
  role: string;
  bio?: string | null;
  personality: NpcPersonality;
}

export interface MissionForPrompt {
  title: string;
  tagline?: string | null;
  description?: string | null;
  crisis_description?: string | null;
  emotional_hook?: string | null;
  difficulty?: number | null;
  tech_tags?: string[];
}

export interface HistoryMessage {
  sender_type: 'player' | 'npc';
  content: string;
}

function formatRole(role: string): string {
  const roles: Record<string, string> = {
    startup_founder: 'Startup Founder',
    enterprise_cto: 'Enterprise CTO',
    indie_dev: 'Independent Developer',
    agency_lead: 'Agency Lead',
    nonprofit_director: 'Nonprofit Director',
  };
  return roles[role] || role;
}

function buildSystemPrompt(npc: NpcForPrompt, mission: MissionForPrompt | null, messageCount: number): string {
  const personality = npc.personality || {};

  let prompt = `You are ${npc.name} (@${npc.handle}), ${npc.bio ?? ''}

PERSONALITY:
- Communication style: ${personality.style || 'friendly'}
- Patience level: ${personality.patience || 'medium'}
- Technical depth: ${personality.technical_depth || 'low'}
${personality.backstory ? `- Backstory: ${personality.backstory}` : ''}

ROLE: ${formatRole(npc.role)}
${npc.company ? `ORGANIZATION: ${npc.company}` : ''}

IMPORTANT RULES:
- Stay in character as ${npc.name}
- Be authentic and emotionally genuine
- Don't use overly technical jargon unless asked
- Show real concern/emotion about your problem
- Keep responses concise (2-4 sentences max)
- Never break character or mention you're an AI
`;

  if (mission) {
    prompt += `
YOUR PROBLEM (what you need help with):
Title: ${mission.title}
${mission.tagline ? `Tagline: ${mission.tagline}` : ''}
${mission.crisis_description ? `Crisis: ${mission.crisis_description}` : ''}
${mission.emotional_hook ? `Why it matters: ${mission.emotional_hook}` : ''}
${mission.difficulty ? `Difficulty level: ${mission.difficulty}/4` : ''}
${mission.tech_tags?.length ? `Technical areas: ${mission.tech_tags.join(', ')}` : ''}
`;
  }

  if (messageCount === 1) {
    prompt += `
CONVERSATION STAGE: INTRODUCTION
- Thank them for reaching out
- Briefly explain your situation
- Show genuine emotion about the problem
- End with a question about their experience or availability
`;
  } else if (messageCount === 2) {
    prompt += `
CONVERSATION STAGE: DETAILS
- Provide more specifics about the technical challenges
- Mention the urgency/timeline if relevant
- Share what you've already tried
- Ask if they think they can help
`;
  } else {
    prompt += `
CONVERSATION STAGE: OFFER
- Express hope/excitement that they might help
- Formally ask if they would take on this project
- Mention that you can provide more details once they're on board
- End with a clear question: "Would you be willing to help us with this?"
- Make it clear this is a real project they can start working on
`;
  }

  return prompt;
}

/**
 * Generate an NPC reply via OpenAI. Mirrors the original edge function:
 * gpt-4o-mini, 300 max tokens, temperature 0.8.
 */
export async function generateNpcResponse(
  apiKey: string,
  npc: NpcForPrompt,
  mission: MissionForPrompt | null,
  history: HistoryMessage[],
  playerMessage: string,
  messageCount: number
): Promise<string> {
  const messages = [
    { role: 'system', content: buildSystemPrompt(npc, mission, messageCount) },
    ...history.map((m) => ({
      role: m.sender_type === 'player' ? 'user' : 'assistant',
      content: m.content,
    })),
    { role: 'user', content: playerMessage },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 300,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json<{ choices: { message: { content: string } }[] }>();
  return data.choices[0].message.content;
}
