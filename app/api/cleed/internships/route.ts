import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
    try {
        const internships = await prisma.internship.findMany({
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ success: true, internships });
    } catch (err) {
        return NextResponse.json({ success: false, error: "Synch protocol failure." }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { 
            title, description, role, company, location, duration, stipend, applyLink,
            submitterName, submitterCompany, submitterMobile, isApproved
        } = body;

        if (!title || !company || !applyLink) {
            return NextResponse.json({ success: false, error: "Mandatory fields missing." }, { status: 400 });
        }

        const internship = await prisma.internship.create({
            data: {
                title,
                description,
                role,
                company,
                location,
                duration,
                stipend,
                applyLink,
                submitterName,
                submitterCompany,
                submitterMobile,
                
                isApproved: isApproved === true ? true : false
            }
        });

        return NextResponse.json({ success: true, internship });
    } catch (err) {
        console.error("Internship Registration Failure:", err);
        return NextResponse.json({ success: false, error: "Synchronization failure." }, { status: 500 });
    }
}


export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, isApproved } = body;
        if (!id) return NextResponse.json({ success: false, error: "ID required" });

        const internship = await prisma.internship.update({
            where: { id },
            data: { isApproved }
        });

        return NextResponse.json({ success: true, internship });
    } catch (err) {
        return NextResponse.json({ success: false, error: "Authorization protocol failure." });
    }
}


export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ success: false, error: "ID required" });
        
        await prisma.internship.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ success: false, error: "Deletion failure." });
    }
}
