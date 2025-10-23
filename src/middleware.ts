import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  try {
    // Por enquanto, vamos desabilitar o middleware para evitar erros
    // O middleware pode ser reativado depois que o sistema estiver funcionando
    
    // Verificar se é uma página que precisa de autenticação
    const protectedPaths = ['/dashboard', '/groups', '/messages', '/employees', '/analytics']
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
    
    // Se for uma página protegida, redirecionar para login
    if (isProtectedPath) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Erro no middleware:', error)
    // Em caso de erro, permitir que a requisição continue
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

