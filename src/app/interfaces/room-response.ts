export interface RoomResponse {
  uuid: string;
  tenantId: string;
  guestId: string;
  guestName: string;
  agentId: string | null;
  status: 'WAITING' | 'ACTIVE' | 'CLOSED';
  createdAt: string;
  closedAt: string | null;
}
