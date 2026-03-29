import type { NextConfig } from "next";

function supabaseRemotePattern() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return null;
  try {
    const { hostname, protocol } = new URL(raw);
    return {
      protocol: protocol === "http:" ? ("http" as const) : ("https" as const),
      hostname,
      pathname: "/**",
    };
  } catch {
    return null;
  }
}

const supabaseImages = supabaseRemotePattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseImages ? [supabaseImages] : [],
  },
};

export default nextConfig;
