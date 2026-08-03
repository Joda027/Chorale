import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

const ROUTES_PUBLIQUES = ["/connexion"];
const PREFIXE_BUREAU = "/bureau";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const estRoutePublique = ROUTES_PUBLIQUES.some((route) =>
    pathname.startsWith(route),
  );

  if (!req.auth && !estRoutePublique) {
    const url = new URL("/connexion", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith(PREFIXE_BUREAU)) {
    const roles = req.auth?.user?.roles ?? [];
    const estBureau = roles.some((role) =>
      [
        "PRESIDENT",
        "SECRETAIRE_GENERAL",
        "TRESORIER",
        "CHARGE_ORGANISATION",
        "CHARGE_SPIRITUEL",
        "CHARGE_DISCIPLINE",
      ].includes(role),
    );
    if (!estBureau) {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
