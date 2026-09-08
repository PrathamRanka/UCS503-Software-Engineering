export const TIET_EMAIL_DOMAINS = ["thapar.edu"] as const;

const TIET_ID_PATTERN = /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?$/i;

export function isTietEmail(value: string) {
  const normalized = value.trim().toLowerCase();
  const parts = normalized.split("@");
  if (parts.length !== 2) return false;

  const [id, domain] = parts;
  return (
    id.length <= 64 &&
    !id.includes("..") &&
    TIET_ID_PATTERN.test(id) &&
    domain === TIET_EMAIL_DOMAINS[0]
  );
}
