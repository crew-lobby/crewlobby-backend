import { Resend } from "resend";

import { env } from "../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

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
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}