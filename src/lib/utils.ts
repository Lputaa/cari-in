export function generateAnonymousId(): string {
  return String(Math.floor(100 + Math.random() * 900));
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
