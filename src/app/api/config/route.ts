
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const configs = await prisma.contentBlock.findMany({
            where: {
                key: {
                    startsWith: 'config_'
                }
            }
        });

        const configMap: Record<string, string> = {};
        configs.forEach(c => {
            // Remove prefix for cleaner frontend usage
            const cleanKey = c.key.replace('config_', '');
            configMap[cleanKey] = c.content;
        });

        // Defaults
        const defaults = {
            maintenance_mode: 'false',
            notifications_email: 'true',
            notifications_new_user: 'true',
            notifications_telegram: 'false',
            job_posting_limit_free: '3',
            job_posting_limit_premium: '-1'
        };

        return NextResponse.json({ ...defaults, ...configMap });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching configs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { key, value } = body;

        if (!key || value === undefined) {
            return NextResponse.json({ error: 'Key and value required' }, { status: 400 });
        }

        const dbKey = `config_${key}`;

        const updated = await prisma.contentBlock.upsert({
            where: { key: dbKey },
            update: { content: String(value) },
            create: {
                key: dbKey,
                content: String(value)
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Config Save Error:", error);
        return NextResponse.json({ error: 'Error saving config' }, { status: 500 });
    }
}
