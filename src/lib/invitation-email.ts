type InvitationEmailInput = {
  organizationName: string;
  inviterName: string;
  invitationLink: string;
};

export function buildInvitationEmailHtml({
  organizationName,
  inviterName,
  invitationLink,
}: InvitationEmailInput): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <p>Hi,</p>
      <p><strong>${inviterName}</strong> invited you to join <strong>${organizationName}</strong> on CrewLobby.</p>
      <p>
        
          href="${invitationLink}"
          style="display: inline-block; padding: 10px 20px; background: #111827; color: #ffffff; text-decoration: none; border-radius: 8px;"
        >
          View invitation
        </a>
      </p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${invitationLink}</p>
    </div>
  `;
}