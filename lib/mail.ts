import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const BASE_URL = "https://platform.studentforge.in";




const getSimpleTemplate = (title: string, content: string, ctaText: string, ctaUrl: string, team: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f4f4; }
        .wrapper { padding: 40px 20px; }
        .container { max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #eeeeee; padding: 0px; border-radius: 0px; overflow: hidden; }
        .header { background-color: #FACC15; padding: 30px 20px; text-align: center; }
        .content { padding: 40px; }
        h1 { font-size: 20px; font-weight: 700; margin: 0 0 16px; color: #000; letter-spacing: -0.01em; }
        p { font-size: 14px; margin: 0 0 24px; color: #444; }
        .button-wrapper { text-align: center; margin-bottom: 24px; }
        .button { display: inline-block; background: #000; color: #fff !important; padding: 14px 28px; text-decoration: none; font-size: 12px; font-weight: 700; border-radius: 0px; text-transform: uppercase; letter-spacing: 0.1em; }
        .footer { background-color: #FACC15; padding: 30px 20px; font-size: 11px; color: #000; text-align: center; }
        .team { font-weight: 700; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <img src="https://ik.imagekit.io/dypkhqxip/Screenshot%202026-04-02%20at%2000.53.30.png" alt="Student Forge" height="28" />
            </div>
            <div class="content">
                <h1>${title}</h1>
                <p>${content}</p>
                <div class="button-wrapper">
                    <a href="${ctaUrl}" class="button">${ctaText}</a>
                </div>
            </div>
            <div class="footer">
                <div class="team">${team}</div>
                <div style="font-weight: 500;">Student Forge Technologies Pvt. Ltd.</div>
                <div style="margin-top: 12px; opacity: 0.7;">&copy; 2026 Student Forge. All rights reserved.</div>
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
            from: '"Student Forge" <studentforgetechnologies@gmail.com>',
            to: email,
            subject: "Reset Your Platform Password",
            html: html,
        });
        return true;
    } catch (error) {
        console.error("Password reset mail error:", error);
        return false;
    }
};

export const sendOfferLetterEmail = async (email: string, name: string) => {
    const title = "Internship Offer Letter Issued";
    const content = `Congratulations ${name}! Your official internship offer letter has been issued. You can now access and download it directly from your dashboard. Welcome to the Student Forge community.`;
    const ctaUrl = `${BASE_URL}/intern/dashboard`;
    const html = getSimpleTemplate(title, content, "View in Dashboard", ctaUrl, "Student Forge Team");

    try {
        await transporter.sendMail({
            from: '"Student Forge" <studentforgetechnologies@gmail.com>',
            to: email,
            subject: `Offer Letter Issued: ${name}`,
            html: html,
        });
        return true;
    } catch (error) {
        console.error("Offer Letter Mail Error:", error);
        return false;
    }
};

export const sendCustomOfferLetterEmail = async (email: string, name: string, offerLetterUrl: string, customMessage: string) => {
    const title = "Welcome to Student Forge | Official Internship Offer";
    const content = `
        Dear ${name},<br/><br/>
        Congratulations! On behalf of the <b>Student Forge HR Team</b>, we are pleased to offer you an internship position with our organization. We were impressed with your profile and believe your skills will be a valuable asset to our upcoming technical initiatives.<br/><br/>
        <b>Offer Details:</b><br/>
        ${customMessage}<br/><br/>
        Attached to this email (via the button below) is your official Internship Offer Letter. Please review the terms and conditions carefully. We are excited to have you join our high-performance community and contribute to industrial-standard projects.<br/><br/>
        Welcome aboard! We look forward to seeing you in the Student Forge ecosystem.
    `;
    const html = getSimpleTemplate(title, content, "Access Offer Letter", offerLetterUrl, "Student Forge HR Team");

    try {
        await transporter.sendMail({
            from: '"Student Forge HR" <studentforgetechnologies@gmail.com>',
            to: email,
            subject: `Internship Offer: ${name} | Student Forge`,
            html: html,
        });
        return true;
    } catch (error) {
        console.error("Custom Offer Letter Mail Error:", error);
        return false;
    }
};

export const sendTeamAssignmentEmail = async (email: string, name: string, projectName: string, mentorName: string, teamMembers: string[]) => {
    const title = "Project Team Assignment";
    const content = `Hello ${name}! You have been assigned to the project: <b>${projectName}</b>.<br/><br/><b>Team Members:</b> ${teamMembers.join(", ")}<br/><b>Mentor:</b> ${mentorName}<br/><br/>You can now synchronize with your team and start working on the milestones.`;
    const ctaUrl = `${BASE_URL}/intern/dashboard/schedule`;
    const html = getSimpleTemplate(title, content, "View Mission Details", ctaUrl, "Student Forge Team");

    try {
        await transporter.sendMail({
            from: '"Student Forge" <studentforgetechnologies@gmail.com>',
            to: email,
            subject: `Project Assignment: ${projectName}`,
            html: html,
        });
        return true;
    } catch (error) {
        console.error("Team Assignment Mail Error:", error);
        return false;
    }
};

export const sendInterviewEmail = async (email: string, name: string, position: string, timing: string) => {
    const title = "Interview Invitation";
    const content = `Hello ${name},<br/><br/>Congratulations! Your application for the <b>${position}</b> position has been shortlisted. We would like to invite you for an interview to further discuss your profile.<br/><br/><b>Interview Timing:</b> ${timing}<br/><b>Location:</b> STUDENT FORGE Corporate office in Hyderabad, Telangana<br/><b>Address:</b> HF2R+CCV, Devender Colony, Kompally, Hyderabad, Telangana 500100<br/><br/>Please confirm your availability by replying to this email. We look forward to meeting you.`;
    const ctaUrl = "https://maps.app.goo.gl/6EGvQ1jbTURoiA1a8";
    const html = getSimpleTemplate(title, content, "View Directions", ctaUrl, "HR Team");

    try {
        await transporter.sendMail({
            from: '"Student Forge HR" <studentforgetechnologies@gmail.com>',
            to: email,
            subject: `Interview Invitation: ${position}`,
            html: html,
        });
        return true;
    } catch (error: any) {
        console.error("Interview Mail Dispatch Failure:", error.message || error);
        if (error.code === 'EAUTH') {
            console.error("Gmail Authentication Failure. Check your APP PASSWORD.");
        }
        return false;
    }
}

export const sendRescheduleEmail = async (email: string, name: string, position: string, timing: string) => {
    const title = "Interview Rescheduled";
    const content = `Hello ${name},<br/><br/>Your interview for the <b>${position}</b> position has been rescheduled. We apologize for any inconvenience caused.<br/><br/><b>Updated Timing:</b> ${timing}<br/><b>Location:</b> STUDENT FORGE Corporate office in Hyderabad, Telangana<br/><b>Address:</b> HF2R+CCV, Devender Colony, Kompally, Hyderabad, Telangana 500100<br/><br/>Please confirm your receipt of this update. We look forward to meeting you.`;
    const ctaUrl = "https://maps.app.goo.gl/6EGvQ1jbTURoiA1a8";
    const html = getSimpleTemplate(title, content, "View Directions", ctaUrl, "HR Team");

    try {
        await transporter.sendMail({
            from: '"Student Forge HR" <studentforgetechnologies@gmail.com>',
            to: email,
            subject: `Updated Schedule: ${position}`,
            html: html,
        });
        return true;
    } catch (error: any) {
        console.error("Reschedule Mail Dispatch Failure:", error.message || error);
        return false;
    }
}

export const sendBootcampRegistrationEmail = async (email: string, name: string) => {
    const title = "Bootcamp Registration Verified";
    const content = `Hello ${name},<br/><br/>Thank you for registering for the <b>Summer Boot Camp 2026</b>. Your application and transaction details have been successfully received and are currently under review by our administration team.<br/><br/>We are excited to have you as part of this interactive technical training initiative. You will receive further updates regarding the orientation and training schedule shortly.`;
    const ctaUrl = "https://platform.studentforge.in/bootcamp";
    const html = getSimpleTemplate(title, content, "View Program Details", ctaUrl, "Platform Division");

    try {
        await transporter.sendMail({
            from: '"Student Forge" <studentforgetechnologies@gmail.com>',
            to: email,
            subject: `Registration Confirmed: Summer Boot Camp 2026`,
            html: html,
        });
        return true;
    } catch (error: any) {
        console.error("Bootcamp Mail Error:", error.message || error);
        return false;
    }
};
export const sendCleedPasswordResetEmail = async (email: string, token: string) => {
    const title = "Password Reset Request";
    const content = "You requested to reset your password for the CLEED portal. Click the button below to set a new password. This link expires in 15 minutes.";
    const resetLink = `${BASE_URL}/cleed/reset-password?token=${token}`;
    
    // Custom template with Cleed Logo
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f8f9fa; }
            .wrapper { padding: 40px 20px; background-color: #f8f9fa; }
            .container { max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #eeeeee; padding: 40px; border-radius: 0px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            .logo { margin-bottom: 30px; text-align: center; }
            h1 { font-size: 22px; font-weight: 700; margin: 0 0 16px; color: #000; letter-spacing: -0.02em; text-align: center; }
            p { font-size: 14px; margin: 0 0 24px; color: #666; text-align: center; line-height: 1.8; }
            .button-container { text-align: center; }
            .button { display: inline-block; background: #000; color: #fff !important; padding: 14px 28px; text-decoration: none; font-size: 13px; font-weight: 700; border-radius: 0px; text-transform: uppercase; letter-spacing: 0.1em; }
            .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center; }
            .team { font-weight: 700; color: #000; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <div class="logo">
                    <img src="https://platform.studentforge.in/clledlogo.png" alt="CLEED" height="60" />
                </div>
                <h1>${title}</h1>
                <p>${content}</p>
                <div class="button-container">
                    <a href="${resetLink}" class="button">Reset Password</a>
                </div>
                <div class="footer">
                    <div class="team">Admin Team</div>
                    <div>CLEED Admin</div>
                    <div style="margin-top: 10px;">&copy; 2026 Student Forge Technologies Pvt. Ltd.</div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: '"Admin Support" <studentforgetechnologies@gmail.com>',
            to: email,
            subject: "Password Reset Link for CLEED",
            html: html,
        });
        return true;
    } catch (error) {
        console.error("Cleed recovery mail error:", error);
        return false;
    }
};
