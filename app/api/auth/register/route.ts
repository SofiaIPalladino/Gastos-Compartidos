import { NextResponse } from 'next/server';
import { authService } from '@/lib/auth-service';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Email, contraseña y nombre son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const result = authService.register(email, password, name);

    if (result.success && result.user) {
      return NextResponse.json({ success: true, user: result.user });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Error al registrarse' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

