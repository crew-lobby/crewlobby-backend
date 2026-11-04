type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailInput): Promise<void> {
  console.log("[email disabled]", {
    to,
    subject,
    html,
  });
}