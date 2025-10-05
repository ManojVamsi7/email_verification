const nodemailer = require('nodemailer');

async function createTransport() {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
  }
  // Mock transporter
  return { sendMail: async (opts) => {
    console.log('--- Mock Email Sent ---');
    console.log('To:', opts.to);
    console.log('Subject:', opts.subject);
    console.log('HTML:', opts.html);
    return Promise.resolve();
  }};
}

module.exports.sendVerificationEmail = async (to, name, data, opts = { type: 'link' }) => {
  const transporter = await createTransport();
  let subject, html;
  if (opts.type === 'otp') {
    subject = 'Your verification code';
    html = `<p>Hi ${name},</p><p>Your verification code is: <b>${data}</b> (expires in 45 minutes)</p>`;
  } else {
    subject = 'Verify your email';
    html = `<p>Hi ${name},</p><p>Click the link to verify: <a href="${data}">${data}</a> (expires in 45 minutes)</p>`;
  }
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@example.com',
    to,
    subject,
    html
  });
};
