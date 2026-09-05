import { describe, expect, it } from 'vitest';
import { renderEmail } from '../src/lib/email';

describe('transactional email rendering', () => {
  it('escapes user-controlled text and rejects unsafe CTA protocols', () => {
    const rendered = renderEmail({
      preheader: '<img src=x onerror=alert(1)>',
      heading: '<script>alert(1)</script>',
      body: 'Hello <b>player</b>',
      ctaLabel: 'Click <me>',
      ctaUrl: 'javascript:alert(1)',
      footer: '<svg onload=alert(1)>',
    });

    expect(rendered.html).not.toContain('<script>');
    expect(rendered.html).not.toContain('javascript:');
    expect(rendered.html).toContain('&lt;b&gt;player&lt;/b&gt;');
    expect(rendered.html).toContain('href="#"');
  });
});
