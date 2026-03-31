import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const BASE_URL = "https://platform.studentforge.in";

/**
 * Simplified Minimalist Email Template
 */
const getSimpleTemplate = (title: string, content: string, ctaText: string, ctaUrl: string, team: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f9f9f9; }
        .wrapper { padding: 40px 20px; }
        .container { max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #eeeeee; padding: 40px; border-radius: 0px; }
        .logo { margin-bottom: 30px; }
        h1 { font-size: 20px; font-weight: 600; margin: 0 0 16px; color: #000; letter-spacing: -0.01em; }
        p { font-size: 14px; margin: 0 0 24px; color: #666; }
        .button { display: inline-block; background: #000; color: #fff !important; padding: 12px 24px; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 0px; transition: background 0.2s; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
        .team { font-weight: 600; color: #000; margin-bottom: 4px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="logo">
                <img src="https://ik.imagekit.io/dypkhqxip/sflogo" alt="Student Forge" height="24" />
            </div>
            <h1>${title}</h1>
            <p>${content}</p>
            <a href="${ctaUrl}" class="button">${ctaText}</a>
            <div class="footer">
                <div class="team">${team}</div>
                <div>Student Forge Technologies</div>
                <div style="margin-top: 10px;">&copy; 2026 Student Forge. Definitive Engineering Accelerator.</div>
            </div>
        </div>
    </div>
</body>
</html>
`;

export const sendApprovalEmail = async (email: string, name: string) => {
    const title = "Your Account is Approved";
    const content = "Hello! Your account is now ready to use. You can now log in to the dashboard and start your work. Welcome to Student Forge.";
    const ctaUrl = `${BASE_URL}/cleed/dashboard`;
    const html = getSimpleTemplate(title, content, "Go to Dashboard", ctaUrl, "Student Forge Team");

    try {
        await transporter.sendMail({
            from: '"Forge Admin" <studentforgetechnologies@gmail.com>',
            to: email,
            subject: `Access Synchronized: Welcome, ${name}`,
            html: html,
        });
        return true;
    } catch (error) {
        console.error("Approval Mail Error:", error);
        return false;
    }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const title = "Reset Your Password";
    const content = "You asked to change your password. Click the button below to set a new password. This link will work for 1 hour. If you did not ask for this, please ignore this email.";
    const resetLink = `${BASE_URL}/intern/reset-password?token=${token}`;
    const html = getSimpleTemplate(title, content, "Change Password", resetLink, "Student Forge Team");

    try {
        await transporter.sendMail({
            from: '"Forge Security" <studentforgetechnologies@gmail.com>',
            to: email,
            subject: "Security Protocol: Reset Access Request",
            html: html,
        });
        return true;
    } catch (error) {
        console.error("Password reset mail error:", error);
        return false;
    }
};
