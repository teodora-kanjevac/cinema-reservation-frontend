export function convertMinutesToHours(totalMinutes?: number): string {
  if (!totalMinutes || totalMinutes < 0) return '0h 0m'

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}h ${minutes}m`
}
