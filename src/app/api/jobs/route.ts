
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch jobs
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const isAdmin = searchParams.get('admin') === 'true';

        // Public view: only show active jobs
        // Admin view: show all except rejected (or all if needed)
        const whereClause = isAdmin
            ? { status: { not: 'rejected' } }
            : { status: 'active' };

        const jobs = await prisma.jobPosting.findMany({
            where: whereClause,
            orderBy: [
                { isFeatured: 'desc' },
                { createdAt: 'desc' }
            ],
            include: {
                _count: {
                    select: { applications: true }
                },
                payments: true // Include payments to show status in admin
            }
        });

        // Transform data to match frontend expectations if necessary
        // The Prisma model has JSON strings for requirements, etc.
        // We need to parse them.

        const formattedJobs = jobs.map(job => ({
            ...job,
            requirements: job.requirements ? JSON.parse(job.requirements) : [],
            responsibilities: job.responsibilities ? JSON.parse(job.responsibilities) : [],
            benefits: job.benefits ? JSON.parse(job.benefits) : [],
            // Add 'posted' relative time if needed, or frontend handles it
            posted: new Date(job.createdAt).toLocaleDateString()
        }));

        return NextResponse.json(formattedJobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json(
            { error: 'Error fetching jobs' },
            { status: 500 }
        );
    }
}

// POST: Create a new job
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.title || !body.company || !body.location || !body.type || !body.description) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Helper to convert string with line breaks to JSON string array
        const textToArrayJson = (text: string) => {
            if (!text) return JSON.stringify([]);
            return JSON.stringify(text.split('\n').filter(line => line.trim() !== ''));
        };

        const isFeaturedRequest = body.isFeatured === true;

        const job = await prisma.jobPosting.create({
            data: {
                title: body.title,
                company: body.company,
                location: body.location,
                type: body.type,
                description: body.description,
                requirements: textToArrayJson(body.requirements),
                responsibilities: textToArrayJson(body.responsibilities),
                benefits: textToArrayJson(body.benefits),
                salary: body.salary || "A convenir",
                status: 'active',
                expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
                isFeatured: false, // Initially false, waits for payment
                payments: isFeaturedRequest ? {
                    create: {
                        amount: 50000, // Example amount
                        status: 'pending',
                        provider: 'manual'
                    }
                } : undefined
            }
        });

        return NextResponse.json(job, { status: 201 });
    } catch (error) {
        console.error('Error creating job:', error);
        return NextResponse.json(
            { error: 'Error creating job' },
            { status: 500 }
        );
    }
}
