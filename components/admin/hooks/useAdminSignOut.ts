import { useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function useAdminSignOut() {
  const router = useRouter();
  return useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }, [router]);
}
