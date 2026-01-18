import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// Helper to get company user ID from cookie
async function getCompanyUserId(): Promise<number | null> {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    const userRole = cookieStore.get('user_role')?.value;

    if (userRole !== 'company' || !authToken?.startsWith('company_')) {
        return null;
    }

    const userId = parseInt(authToken.replace('company_', ''));
    return isNaN(userId) ? null : userId;
}

// GET: List applications for the logged-in company's job postings
export async function GET() {
    try {
        const companyUserId = await getCompanyUserId();

        if (!companyUserId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Get all job posting IDs for this company
        const companyJobs = await prisma.jobPosting.findMany({
            where: { companyUserId } as any,
            select: { id: true }
        });

        const jobIds = companyJobs.map(job => job.id);

        if (jobIds.length === 0) {
            return NextResponse.json([]);
        }

        // Get all applications for these job postings
        const applications = await prisma.application.findMany({
            where: {
                jobPostingId: { in: jobIds }
            },
            orderBy: { createdAt: 'desc' },
            include: {
                jobPosting: {
                    select: {
                        id: true,
                        title: true,
                        company: true,
                        status: true
                    }
                },
                cVAnalysis: true
            }
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error('Error fetching company applications:', error);
        return NextResponse.json({ error: 'Error al obtener postulaciones' }, { status: 500 });
    }
}
