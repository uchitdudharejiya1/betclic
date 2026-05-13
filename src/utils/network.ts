export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export const jitter = (ms: number): number =>
  Math.round(ms * (0.75 + Math.random() * 0.5));

export const backoff = (attempt: number, baseMs = 500, capMs = 8_000): number =>
  Math.min(capMs, jitter(baseMs * 2 ** attempt));
