import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the Supabase session, guards /admin routes, and tells pages their
// path (x-pathname) so a private site can send visitors back after the preview password.
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  request.headers.set("x-pathname", pathname + search);
  let response = NextResponse.next({ request });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  const isAdmin = pathname.startsWith("/admin");
  // Public pages only need the session refreshed for people who are logged in.
  if (!isAdmin && !request.cookies.getAll().some((c) => c.name.startsWith("sb-"))) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdmin) return response;

  const isLogin = pathname.startsWith("/admin/login");
  if (!user && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  if (user && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Everything except static files and the lead API.
  matcher: ["/((?!_next/static|_next/image|api/|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpe?g|gif|webp|svg|ico|css|js|woff2?)$).*)"],
};
