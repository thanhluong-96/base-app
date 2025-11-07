import { Errors, createClient } from "@farcaster/quick-auth";
import { NextRequest, NextResponse } from "next/server";

const client = createClient();

// Helper function to determine the correct domain for JWT verification
function getUrlHost(request: NextRequest): string {
  // Prefer x-forwarded-host as it reflects the deployed domain in proxied environments
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    return forwardedHost;
  }

  // Next.js exposes the actual request URL via nextUrl
  if (request.nextUrl?.host) {
    return request.nextUrl.host;
  }

  // Fallback to Host header
  const host = request.headers.get("host");
  if (host) {
    return host;
  }

  // Final fallback to environment variables (original logic)
  const urlValue = process.env.NEXT_PUBLIC_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return new URL(urlValue).host;
}

export async function GET(request: NextRequest) {
  // Because we're fetching this endpoint via `sdk.quickAuth.fetch`,
  // if we're in a mini app, the request will include the necessary `Authorization` header.
  const authorization = request.headers.get("Authorization");

  // Here we ensure that we have a valid token.
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing token" }, { status: 401 });
  }

  try {
    // Now we verify the token. `domain` must match the domain of the request.
    // In our case, we're using the `getUrlHost` function to get the domain of the request
    // based on the Vercel environment. This will vary depending on your hosting provider.
    const payload = await client.verifyJwt({
      token: authorization.split(" ")[1] as string,
      domain: getUrlHost(request),
    });

    console.log("payload", payload);

    // If the token was valid, `payload.sub` will be the user's Farcaster ID.
    const userFid = payload.sub;

    // Return user information for your waitlist application
    return NextResponse.json({
      success: true,
      user: {
        fid: userFid,
        issuedAt: payload.iat,
        expiresAt: payload.exp,
      },
    });

  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    if (e instanceof Error) {
      return NextResponse.json({ message: e.message }, { status: 500 });
    }
    throw e;
  }
}