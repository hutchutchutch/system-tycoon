/**
 * Minimal `formatDistanceToNow` — a dependency-free stand-in for the date-fns
 * helper used by the social feed / conversation UIs.
 *
 * Example: formatDistanceToNow(new Date(ts), { addSuffix: true }) -> "5 minutes ago"
 */
export function formatDistanceToNow(date: Date, opts: { addSuffix?: boolean } = {}): string {
  const diffMs = Date.now() - date.getTime();
  const future = diffMs < 0;
  const seconds = Math.abs(Math.round(diffMs / 1000));

  const units: [number, string][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.345, 'week'],
    [12, 'month'],
    [Number.POSITIVE_INFINITY, 'year'],
  ];

  let value = seconds;
  let unit = 'second';
  for (const [size, name] of units) {
    if (value < size) {
      unit = name;
      break;
    }
    value = Math.floor(value / size);
    unit = name;
  }

  if (unit === 'second' && value < 30) {
    return opts.addSuffix ? 'less than a minute ago' : 'less than a minute';
  }

  const label = `${value} ${unit}${value === 1 ? '' : 's'}`;
  if (!opts.addSuffix) return label;
  return future ? `in ${label}` : `${label} ago`;
}
