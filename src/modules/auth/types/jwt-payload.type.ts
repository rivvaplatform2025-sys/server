// -----------------------------
// TYPES
// -----------------------------

export interface JwtAccessPayload {
  sub: string;
  email: string;
  roles: string[];
  organizationId?: string;
}

export interface JwtRefreshPayload {
  sub: string;
}
