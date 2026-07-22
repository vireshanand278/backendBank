
const nodemailer = require('nodemailer');




// connect with smtp serveer which sends email 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});



// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"backendBank" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


async function sendRegistrationEmail(userEmail,name) {
    const subject = "🎉 Welcome to BackendBank!";

    const text = `
Hello ${name},

Welcome to BackendBank!

Thank you for creating your account.

Your account has been successfully registered and is ready to use.

If you did not create this account, please ignore this email.

Thank you,
The BackendBank Team
`;

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Welcome to BackendBank</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

<!-- Header -->
<tr>
<td align="center"
style="background:linear-gradient(135deg,#0f172a,#1e3a8a);padding:40px;color:white;">
<h1 style="margin:0;font-size:34px;">
🏦 BackendBank
</h1>

<p style="margin-top:12px;font-size:16px;opacity:0.9;">
Secure • Fast • Reliable
</p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;color:#333;line-height:1.8;">

<h2 style="margin-top:0;">
Welcome, ${name}! 👋
</h2>

<p>
We're excited to have you join <strong>BackendBank</strong>.
Your account has been successfully created and is ready to use.
</p>

<p>
With BackendBank you can securely manage your account,
authenticate safely, and enjoy a modern banking experience.
</p>

<div
style="background:#f8fafc;border-left:5px solid #2563eb;padding:18px;margin:30px 0;border-radius:6px;">
<strong>Account Status</strong><br><br>
✅ Registration Successful<br>
🔒 Security Enabled<br>
📅 Joined: ${new Date().toLocaleDateString()}
</div>

<div style="text-align:center;margin:40px 0;">



</div>

<p style="font-size:15px;">
If you did not create this account, please ignore this email or
contact our support team immediately.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td align="center"
style="background:#f8fafc;padding:25px;color:#666;font-size:13px;">

<p style="margin:0;">
Thank you for choosing BackendBank ❤️
</p>

<p style="margin-top:8px;">
© ${new Date().getFullYear()} BackendBank. All Rights Reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
    
    console.log("Sending registration email to:", userEmail);
    await sendEmail(userEmail, subject, text, html);
}

module.exports = {sendRegistrationEmail};