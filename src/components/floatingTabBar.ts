export function getFloatingTabBarMetrics(bottomInset: number) {
  return {
    left: 20,
    right: 20,
    bottom: Math.max(8, bottomInset - 18),
    height: 64,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 32
  };
}