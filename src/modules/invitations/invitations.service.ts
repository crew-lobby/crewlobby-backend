import { AppError } from "../../shared/errors/app-error.js";
import { InvitationsRepository } from "./invitations.repository.js";
import type {
  InvitationPreview,
  InvitationPreviewStatus,
} from "./invitations.types.js";

const FINAL_STATUSES: InvitationPreviewStatus[] = [
  "accepted",
  "rejected",
  "canceled",
];

function resolveStatus(
  status: string,
  expiresAt: Date,
): InvitationPreviewStatus {
  if (status === "pending") {
    return expiresAt.getTime() < Date.now() ? "expired" : "pending";
  }

  const finalStatus = FINAL_STATUSES.find((candidate) => candidate === status);

  return finalStatus ?? "canceled";
}

export class InvitationsService {
  private readonly repository = new InvitationsRepository();

  async getPreview(invitationId: string): Promise<InvitationPreview> {
    const record = await this.repository.findPreviewById(invitationId);

    if (!record) {
      throw new AppError(404, "Invitation not found");
    }

    return {
      ...record,
      status: resolveStatus(record.status, record.expiresAt),
    };
  }
}