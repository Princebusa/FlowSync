import nodemailer from "nodemailer";
import { fillTemplate } from "../helpers.ts";

export async function runMail(metadata: any, input: any) {
  const { host, port, user, password, to } = metadata || {};

  if (!host || !port || !user || !password || !to) {
    throw new Error("Mail node needs host, port, user, password, and to");
  }

  const subject = fillTemplate(metadata.subject || "Workflow alert", input);
  const body = fillTemplate(metadata.body || "Workflow finished.", input);

  console.log(`[mail] sending to ${to}`);

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass: password },
  });

  const info = await transporter.sendMail({
    from: user,
    to,
    subject,
    text: body,
  });

  return { success: true, messageId: info.messageId };
}
