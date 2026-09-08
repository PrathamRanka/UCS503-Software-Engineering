export const TIET_EMAIL_DOMAINS = ["thapar.edu"] as const;

export function isTietEmail(value: string) {
  const normalized = value.trim().toLowerCase();
  const separator = normalized.lastIndexOf("@");
  if (separator <= 0) return false;
  const domain = normalized.slice(separator + 1);
  return TIET_EMAIL_DOMAINS.some(
    (allowedDomain) =>
      domain === allowedDomain || domain.endsWith(`.${allowedDomain}`),
  );
}
