import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.staging';
dotenv.config({ path: envFile });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const smtpConfig = {
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: true,
  auth: {
    user: process.env.DAIRA_GMAIL_USERNAME,
    pass: process.env.DAIRA_GMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

const loadEmailTemplate = (templatePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(templatePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

export const sendAmbassadorCredentials = async (name, to, token) => {
  const templatePath = path.join(
    __dirname,
    '../Public/assets/ambassador_confirmation_mail.html'
  );
  const activationURL = `${process.env.FRONTEND_URL}/ambassador-activation?token=${token}`;

  try {
    let emailHtml = await loadEmailTemplate(templatePath);
    emailHtml = emailHtml.replace('{name}', name);
    emailHtml = emailHtml.replace('{activationURL}', activationURL);

    const mailOptions = {
      from: '"Daira.PK" <your-email@example.com>',
      to: to,
      subject: 'Ambassador Activation',
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Failed to send ambassador credentials', error);
    throw error;
  }
};

export const sendVerificationEmail = async (name, to, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const templatePath = path.join(
    __dirname,
    '../Public/assets/mail_template.html'
  );

  try {
    let emailHtml = await loadEmailTemplate(templatePath);
    emailHtml = emailHtml.replace('{name}', name);
    emailHtml = emailHtml.replace('{verificationURL}', verificationUrl);

    const mailOptions = {
      from: '"Daira.PK" <your-email@example.com>',
      to: to,
      subject: 'Email Verification',
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Failed to send verification email', error);
    throw error;
  }
};

export const sendForgetPassEmail = async (name, to, otp) => {
  const templatePath = path.join(
    __dirname,
    '../Public/assets/mail_forgetpass_template.html'
  );

  try {
    let emailHtml = await loadEmailTemplate(templatePath);
    emailHtml = emailHtml.replace('{name}', name);
    emailHtml = emailHtml.replace('{your OTP}', otp);

    const mailOptions = {
      from: '"Daira.PK" <your-email@example.com>',
      to: to,
      subject: 'Email Verification',
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Failed to send OTP email', error);
    throw error;
  }
};
