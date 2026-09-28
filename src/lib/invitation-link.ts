import { env } from "../config/env.js";

export function buildInvitationLink(invitationId: string): string {
  return `${env.FRONTEND_URL}/accept-invitation/${invitationId}`;
}