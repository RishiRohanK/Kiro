import { Metadata } from "next";
import prisma from "@/lib/prisma";
import CoursesListContent from "./CoursesListContent";

export const metadata: Metadata = {
  title: "Professional Engineering Courses | Student Forge Academy",
  description: "Explore our industry-standard curriculum. Master modern software engineering with expert-led courses and professional projects.",
  keywords: ["Software Engineering Courses", "Coding Bootcamp", "Full Stack Development", "System Design", "Cloud Computing"],
  openGraph: {
    title: "Student Forge Academy - Professional Engineering Curriculum",
    description: "Build your engineering career with our specialized learning infrastructure and expert-led certifications.",
    images: ["/sf-next-logo.png"],
    type: "website",
  },
  alternates: {
    canonical: "https://studentforge.in/courses",
  }
};

export default async function Page() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" }
  });

  // Serialize and pass to client component
  const serializedCourses = JSON.parse(JSON.stringify(courses));

  return <CoursesListContent initialCourses={serializedCourses} />;
}
