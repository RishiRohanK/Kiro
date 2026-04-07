import { Metadata } from "next";
import prisma from "@/lib/prisma";
import CourseDetailContent from "./CourseDetailContent";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id: id }
  });

  if (!course) return { title: "Course Not Found" };
  
  const siteUrl = "https://studentforge.in";
  
  return {
    title: `${course.title} | Student Forge Academy`,
    description: course.description?.substring(0, 160) || "Join our modern curriculum and build professional engineering skills.",
    keywords: ["Student Forge", "Academy", course.title, "Engineering", "Courses", "Interships"],
    openGraph: {
      title: course.title,
      description: course.description,
      images: [{ url: course.thumbnail || "/sf-next-logo.png", width: 1200, height: 630 }],
      url: `${siteUrl}/courses/${id}`,
      type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: course.title,
        description: course.description,
        images: [course.thumbnail || "/sf-next-logo.png"],
    },
    alternates: {
      canonical: `${siteUrl}/courses/${id}`,
    }
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id: id }
  });

  if (!course) return <div className="p-24 text-center">Course not found.</div>;

  
  const serializedCourse = JSON.parse(JSON.stringify(course));

  return <CourseDetailContent course={serializedCourse} id={id} />;
}
