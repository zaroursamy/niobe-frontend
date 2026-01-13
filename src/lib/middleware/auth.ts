import { isRedirect, redirect } from "@tanstack/react-router";

import { checkAuth } from "@/lib/auth";

export type RequireAuthArgs = {
  location: {
    href: string;
  };
};

export type RequireAuthResult = {
  user: Awaited<ReturnType<typeof checkAuth>>;
};

// Middleware-like helper that ensures a user is authenticated before allowing the route to load.
// Redirects to sign-in when unauthenticated, preserving the original destination.
export async function requireAuth({
  location,
}: RequireAuthArgs): Promise<RequireAuthResult> {
  try {
    const user = await checkAuth();
    return { user };
  } catch (error) {
    if (isRedirect(error)) throw error;

    throw redirect({
      to: "/auth/signin",
      search: { redirect: location.href },
    });
  }
}
