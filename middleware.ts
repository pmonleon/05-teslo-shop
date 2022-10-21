// middleware.ts
import { NextFetchEvent, NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwt } from "./utils";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, ev: NextFetchEvent) {
  const { cookies } = request;
  const cookiesProp = cookies as unknown;
  const { token } = cookiesProp as { token: string };

  // if (
  //   request.nextUrl.pathname.split("/").includes("address") ||
  //   request.nextUrl.pathname.split("/").includes("summary")
  // ) {
  //   if (!!token) {
  //     console.log(token);
  //     return NextResponse.next();
  //   } else {
  //     return NextResponse.redirect(new URL(`/auth/login`, request.url));
  //   }
  // try {
  //  await jwt.isValidToken(token);
  //  return NextResponse.next();
  // } catch (error) {
  //   return NextResponse.redirect(new URL(`/auth/login`, request.url));
  // }
  //}

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
