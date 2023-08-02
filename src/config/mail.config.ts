import { createTransport, Transporter } from 'nodemailer';

export const transporter: Transporter = createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL as string,
    pass: process.env.APP_PASS as string,
  },
});

export const mailerConfig = {
  transport: transporter,
};
