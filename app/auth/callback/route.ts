import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  console.log("=== Auth Callback GET ===");
  console.log("url:", request.url);
  console.log("code present:", !!code);

  if (code) {
    const supabase = await createClient();
    console.log("Exchanging code for session...");
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("exchangeCodeForSession error:", error);
    } else {
      console.log("Session exchanged successfully.");
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log("User from getUser():", user?.id, user?.email);

      if (user) {
        console.log("Checking if admin exists in m_admin...");
        const { data: adminExists, error: adminError } = await supabase
          .from("m_admin")
          .select("admin_id")
          .eq("admin_id", user.id)
          .single();

        console.log("adminExists search result:", adminExists, "error:", adminError?.message);

        if (!adminExists) {
          console.log("Admin not found. Inserting new admin profile...");
          const { error: insertError } = await supabase.from("m_admin").insert({
            admin_id: user.id,
            nama_lengkap: user.user_metadata?.full_name || user.user_metadata?.nama_lengkap || user.email?.split("@")[0] || "Admin",
            email: user.email!,
            no_hp: null,
            role: "Super Admin",
            created_at: new Date().toISOString(),
          });
          if (insertError) {
            console.error("Failed to insert admin profile:", insertError);
          } else {
            console.log("Admin profile inserted successfully.");
          }
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      
      let redirectUrl = `${origin}${next}`;
      if (isLocalEnv) {
        redirectUrl = `${origin}${next}`;
      } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`;
      } else {
        redirectUrl = `${origin}${next}`;
      }

      console.log("Redirecting user to:", redirectUrl);
      return NextResponse.redirect(redirectUrl);
    }
  }

  console.log("Authentication failed. Redirecting to login with error.");
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}
