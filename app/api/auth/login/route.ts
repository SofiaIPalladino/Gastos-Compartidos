import { NextResponse } from 'next/server';
import { authService } from '@/lib/auth-service';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const result = authService.login(email, password);

    if (result.success && result.user) {
      return NextResponse.json({ success: true, user: result.user });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Error al iniciar sesión' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

