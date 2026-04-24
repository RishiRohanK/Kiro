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
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #ffffff; }
        .wrapper { padding: 40px 20px; background-color: #ffffff; }
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
                <img src="https://ik.imagekit.io/dypkhqxip/Screenshot%202026-04-02%20at%2000.53.30.png" alt="Student Forge" height="24" />
            </div>
            <h1>${title}</h1>
            <p>${content}</p>
            <a href="${ctaUrl}" class="button">${ctaText}</a>
            <div class="footer">
                <div class="team">${team}</div>
                <div>Student Forge</div>
                <div style="margin-top: 10px;">&copy; 2026 Student Forge Technologies Pvt. Ltd.</div>
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
    const title = "Administrative Recovery Request";
    const content = "A password recovery sequence has been initiated for the CLEED administrative portal. Click the button below to access the secure recovery terminal. This link will expire in 15 minutes.";
    const resetLink = `${BASE_URL}/cleed/reset-password?token=${token}`;
    const html = getSimpleTemplate(title, content, "Access Recovery Terminal", resetLink, "System Integrity Division");

    try {
        await transporter.sendMail({
            from: '"System Recovery" <studentforgetechnologies@gmail.com>',
            to: email,
            subject: "SECURITY ALERT: CLEED Password Recovery",
            html: html,
        });
        return true;
    } catch (error) {
        console.error("Cleed recovery mail error:", error);
        return false;
    }
};
