import { Worker } from "bullmq";
import { redis } from "../lib/redis";
import { 
  sendApprovalEmail, 
  sendPasswordResetEmail, 
  sendOfferLetterEmail, 
  sendCustomOfferLetterEmail,
  sendTeamAssignmentEmail,
  sendInterviewEmail,
  sendRescheduleEmail,
  sendBootcampRegistrationEmail,
  sendCleedPasswordResetEmail
} from "../lib/mail";

const worker = new Worker(
  "emailQueue",
  async (job) => {
    const { type, data } = job.data;
    console.log(`Processing email job: ${type} for ${data.email}`);

    switch (type) {
      case "approval":
        await sendApprovalEmail(data.email, data.name);
        break;
      case "password-reset":
        await sendPasswordResetEmail(data.email, data.token);
        break;
      case "offer-letter":
        await sendOfferLetterEmail(data.email, data.name);
        break;
      case "custom-offer-letter":
        await sendCustomOfferLetterEmail(data.email, data.name, data.offerLetterUrl, data.customMessage);
        break;
      case "team-assignment":
        await sendTeamAssignmentEmail(data.email, data.name, data.projectName, data.mentorName, data.teamMembers);
        break;
      case "interview":
        await sendInterviewEmail(data.email, data.name, data.position, data.timing);
        break;
      case "reschedule":
        await sendRescheduleEmail(data.email, data.name, data.position, data.timing);
        break;
      case "bootcamp-registration":
        await sendBootcampRegistrationEmail(data.email, data.name);
        break;
      case "cleed-password-reset":
        await sendCleedPasswordResetEmail(data.email, data.token);
        break;
      case "generic":
        console.log("Generic email to:", data.to, "Subject:", data.subject);
        // Implement generic sendEmail if needed
        break;
      default:
        console.warn(`Unknown email job type: ${type}`);
    }
  },
  {
    connection: redis,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

console.log("Email worker started...");
