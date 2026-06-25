import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  console.log(`[Proxy] request path: ${request.nextUrl.pathname}`);
  
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    console.error(`[Proxy] getUser error:`, userError.message);
  }

  console.log(`[Proxy] user exists: ${!!user} (email: ${user?.email || 'N/A'})`);

  const pathname = request.nextUrl.pathname;

  // Protect all routes except /login, /auth/callback, api routes (if any needed), and static assets
  if (!user && pathname !== "/login" && !pathname.startsWith("/auth/")) {
    console.log(`[Proxy] Unauthenticated access to ${pathname}. Redirecting to /login.`);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from the login page to the dashboard
  if (user && pathname === "/login") {
    console.log(`[Proxy] Authenticated user on /login. Redirecting to /dashboard.`);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - image formats (png, svg, jpg, jpeg, gif, webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
