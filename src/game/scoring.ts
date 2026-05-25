export function calculateStars(mistakes: number, hintsUsed: number): number {
  if (mistakes === 0 && hintsUsed === 0) {
    return 3;
  }

  if (mistakes <= 1 && hintsUsed <= 1) {
    return 2;
  }

  return 1;
}
