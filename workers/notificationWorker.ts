import { Worker } from "bullmq";
import { redis } from "../lib/redis";

const worker = new Worker(
  "notificationQueue",
  async (job) => {
    const { userId, message } = job.data;

    console.log(`Sending notification to User ${userId}: ${message}`);

    // Here you would integrate with Firebase, OneSignal, etc.
    // await sendPushNotification(userId, message);
  },
  {
    connection: redis,
  }
);

worker.on("completed", (job) => {
  console.log(`Notification job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Notification job ${job?.id} failed`, err);
});

console.log("Notification worker started...");
