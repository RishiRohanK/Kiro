import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { emailQueue } from "@/queues/emailQueue";

export async function GET() {
  try {
    const employees = await prisma.user.findMany({
      where: {
        role: {
          not: "INTERN"
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, password, role, batch } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Employee with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employeeCount = await prisma.user.count({
      where: { role: { not: "INTERN" } }
    });
    const nextIdNumber = String(employeeCount + 1).padStart(3, '0');
    const autoEmployeeId = `SF26EMP${nextIdNumber}`;

    const employee = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        batch: batch || "Batch 1",
        isApproved: true,
        employeeId: autoEmployeeId,
      }
    });
    
    // Automation: Dispatch Onboarding Email
    await emailQueue.add("onboard-employee", {
      type: "onboard-employee",
      data: {
        email: employee.email,
        name: employee.name,
        role: employee.role,
        password: password // Original password before hashing
      }
    });

    return NextResponse.json({ success: true, employee });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, email, role, employeeId, phoneNumber, department, reportingManager, location, employmentType, batch } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    const updatedEmployee = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        employeeId,
        phoneNumber,
        department,
        reportingManager,
        location,
        employmentType,
        batch
      }
    });

    return NextResponse.json({ success: true, employee: updatedEmployee });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}
