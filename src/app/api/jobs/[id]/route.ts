
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch single job by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const job = await prisma.jobPosting.findUnique({
            where: { id },
            include: { payments: true }
        });

        if (!job) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            );
        }

        const formattedJob = {
            ...job,
            requirements: job.requirements ? JSON.parse(job.requirements) : [],
            responsibilities: job.responsibilities ? JSON.parse(job.responsibilities) : [],
            benefits: job.benefits ? JSON.parse(job.benefits) : [],
        };

        return NextResponse.json(formattedJob);
    } catch (error) {
        console.error('Error fetching job:', error);
        return NextResponse.json(
            { error: 'Error fetching job' },
            { status: 500 }
        );
    }
}

// PATCH: Update job
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);
        const body = await request.json();

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const currentJob = await prisma.jobPosting.findUnique({ where: { id } });
        if (!currentJob) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

        // Handle isFeatured logic
        let isFeatured = currentJob.isFeatured;
        let createdPayment = null;

        if (body.isFeatured !== undefined) {
            if (body.isFeatured === true && !currentJob.isFeatured) {
                // Requesting to feature
                // Create payment, do NOT set isFeatured=true yet
                createdPayment = await prisma.payment.create({
                    data: {
                        jobPostingId: id,
                        amount: 50000,
                        status: 'pending',
                        provider: 'manual'
                    }
                });
                // Keep isFeatured false until payment confirmed
                isFeatured = false;
            } else if (body.isFeatured === false) {
                // Disabling feature
                isFeatured = false;
            }
        }

        // Prepare data for Prisma (convert arrays to JSON strings)
        const updateData: any = { ...body };
        if (body.requirements) updateData.requirements = JSON.stringify(body.requirements);
        if (body.responsibilities) updateData.responsibilities = JSON.stringify(body.responsibilities);
        if (body.benefits) updateData.benefits = JSON.stringify(body.benefits);

        // Handle isFeatured override by logic above
        if (body.isFeatured !== undefined) {
            updateData.isFeatured = isFeatured;
            // If we just created a payment, we don't enable it yet.
            // If we disabled it, it is false.
        }

        // Remove ID from update data just in case
        delete updateData.id;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        // Don't update payments via this endpoint
        delete updateData.payments;

        const updatedJob = await prisma.jobPosting.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ ...updatedJob, createdPayment });
    } catch (error) {
        console.error('Error updating job:', error);
        return NextResponse.json(
            { error: 'Error updating job' },
            { status: 500 }
        );
    }
}
// DELETE: Delete job
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        await prisma.jobPosting.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Job deleted' });
    } catch (error) {
        console.error('Error deleting job:', error);
        return NextResponse.json(
            { error: 'Error deleting job' },
            { status: 500 }
        );
    }
}
