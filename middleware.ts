// middleware.ts
import { NextFetchEvent, NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwt } from "./utils";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(
  request: NextRequest | any,
  ev: NextFetchEvent
) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (request.nextUrl.pathname.startsWith("/checkout/address")) {
    if (!token) {
      // Not Signed in
      console.log(request.url);
      return NextResponse.redirect(
        new URL("/auth/login?page=/checkout/address", request.url)
      );
    } else {
      return NextResponse.next();
    }
  }
  if (request.nextUrl.pathname.startsWith("/checkout/summary")) {
    if (!token) {
      // Not Signed in
      console.log(request.url);
      return NextResponse.redirect(
        new URL("/auth/login?page=/checkout/summary", request.url)
      );
    } else {
      return NextResponse.next();
    }
  }

  if (request.nextUrl.pathname.startsWith("/api/entries/")) {
    const id = request.nextUrl.pathname.replace("/api/entries/", "");
    console.log({ id });
    const checkMongoIDRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    // @ts-ignore
    if (!checkMongoIDRegExp.test(id)) {
      const url = request.nextUrl.clone();
      url.pathname = "/api/bad-request";
      url.search = `?message=${id} is not a valid id`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // return NextResponse.redirect(new URL('/about-2', request.url))
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
// export const config = {
//   // matcher: "/api/:path*",
//   matcher: [
//     // "/api/:path",
//     "/api/entries/:path",
//     "checkout/:ptah*",
//   ],
// };
