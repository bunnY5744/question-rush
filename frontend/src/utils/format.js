export function accuracy(correct, total) { return total ? Math.round((correct / total) * 10000) / 100 : 0; }
export function formatTime(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
export function gradeFor(acc) {
  if (acc >= 90) return 'Brain Champion!';
  if (acc >= 70) return 'Sharp Thinker!';
  if (acc >= 50) return 'Good Effort!';
  return 'Keep Practising!';
}
export const CATEGORIES = [
  { id: 'mixed', name: 'Mixed Rush', icon: '⚡', desc: 'A surprise mix of every category.' },
  { id: 'math', name: 'Math', icon: '➗', desc: 'Percentages, roots, areas and averages.' },
  { id: 'sequences', name: 'Number Sequences', icon: '🔢', desc: 'Find the next number in the pattern.' },
  { id: 'logic', name: 'Logical Reasoning', icon: '🧠', desc: 'Deduction, analogies and classic traps.' },
  { id: 'patterns', name: 'Pattern Recognition', icon: '🧩', desc: 'Letter, number and visual patterns.' },
  { id: 'arithmetic', name: 'Arithmetic Puzzles', icon: '✖️', desc: 'Fast mental maths with a twist.' },
];
