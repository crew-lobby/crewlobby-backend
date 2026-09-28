export type InvitationPreviewStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "canceled"
  | "expired";

export type InvitationPreview = {
  id: string;
  email: string;
  role: string | null;
  status: InvitationPreviewStatus;
  expiresAt: Date;
  organizationId: string;
  organizationName: string;
  inviterName: string;
};

export type InvitationPreviewRecord = Omit<InvitationPreview, "status"> & {
  status: string;
};