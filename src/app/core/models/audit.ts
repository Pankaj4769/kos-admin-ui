export interface AuditLogResponse {
  id: number;
  actorEmail: string | null;
  actorRole: string | null;
  action: string;
  httpMethod: string | null;
  path: string | null;
  targetType: string | null;
  targetId: string | null;
  ipAddress: string | null;
  outcome: string | null;
  detailsJson: string | null;
  createdAt: string;
}
