import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  // We can't easily hit backend API from edge middleware, so we just check token existence.
  // Full role protection is handled gracefully on client side in AuthProvider and Layouts.
  // We'll just do basic routing protection here.

  const token = request.cookies.get("tuloong_token")?.value; 
  // Note: axios saves to localStorage currently, so middleware cannot easily read it unless we also set cookie.
  // Since we save token in localStorage, client-side protection is better. 
  // Let's pass the request through and let Layouts handle redirects based on AuthProvider.

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
