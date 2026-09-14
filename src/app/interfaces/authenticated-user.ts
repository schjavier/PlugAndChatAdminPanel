export interface AuthenticatedUser {
  email: string;
  roles: { authority: string }[];
  tenantId: string | null;
}
