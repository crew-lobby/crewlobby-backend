import { z } from "zod";

export const invitationParamsSchema = z
  .object({
    invitationId: z.uuid("Invalid invitation"),
  })
  .strict();

export type InvitationParamsSchema = z.infer<typeof invitationParamsSchema>;