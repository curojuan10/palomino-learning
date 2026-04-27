import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { rolId, userId } = await request.json();

    if (!rolId || !userId) {
      return NextResponse.json(
        { error: 'rolId y userId son requeridos' },
        { status: 400 }
      );
    }

    // Determinar el rol como string
    const roleString = rolId === 1 ? 'ADMIN' : 'CLIENTE';

    // Crear respuesta con cookie
    const response = NextResponse.json(
      { success: true, role: roleString },
      { status: 200 }
    );

    // Guardar el rol en cookie (válida por 7 días)
    response.cookies.set('user-role', roleString, {
      httpOnly: false, // Permitir acceso desde client
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    });

    // Guardar userId también
    response.cookies.set('user-id', userId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en set-role:', error);
    return NextResponse.json(
      { error: 'Error al guardar el rol' },
      { status: 500 }
    );
  }
}
