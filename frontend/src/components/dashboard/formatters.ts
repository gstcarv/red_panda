export function formatGpa(value: number) {
  return value.toFixed(2);
}

export function formatCredits(earned: number, max: number) {
  return `${earned}/${max}`;
}

export function formatGraduationPercent(value: number) {
  return `${Math.round(value)}%`;
}
