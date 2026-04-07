import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        
        const contact = await prisma.contact.create({
            data: {
                name,
                email,
                subject: subject || "No Subject",
                message,
            },
        });

        return NextResponse.json({ success: true, data: contact });
    } catch (error: any) {
        console.error("[API] Contact POST Error:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        
        const contacts = await prisma.contact.findMany({
            orderBy: { createdAt: 'desc' }
        });
        
        return NextResponse.json({ 
            success: true, 
            contacts: contacts || [], 
            count: contacts.length 
        });
    } catch (error: any) {
        console.error("[API] Contact GET Error:", error.message);
        return NextResponse.json({ 
            success: false, 
            error: "Failed to synchronize inquiry logs. " + error.message 
        }, { status: 500 });
    }
}
