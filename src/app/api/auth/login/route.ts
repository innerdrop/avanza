import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password, email } = body;

        // Check hardcoded admin credentials first
        if (username === 'adminavanza' && password === 'ZA2025ava') {
            const response = NextResponse.json({ success: true, role: 'admin' });

            response.cookies.set('auth_token', 'admin_session', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });

            response.cookies.set('user_role', 'admin', {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24,
                path: '/',
            });

            return response;
        }

        // Check company login via email/password
        if (email && password) {
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (user && user.role === 'company') {
                const isValidPassword = await bcrypt.compare(password, user.password);

                if (isValidPassword) {
                    const response = NextResponse.json({
                        success: true,
                        role: 'company',
                        user: {
                            id: user.id,
                            email: user.email,
                            name: user.name
                        }
                    });

                    response.cookies.set('auth_token', `company_${user.id}`, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 60 * 60 * 24 * 7, // 7 days
                        path: '/',
                    });

                    response.cookies.set('user_role', 'company', {
                        httpOnly: false,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 60 * 60 * 24 * 7,
                        path: '/',
                    });

                    response.cookies.set('user_id', String(user.id), {
                        httpOnly: false,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 60 * 60 * 24 * 7,
                        path: '/',
                    });

                    return response;
                }
            }
        }

        return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

