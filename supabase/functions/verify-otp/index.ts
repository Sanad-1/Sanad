// Supabase Edge Function: verify-otp
// Body: { phone: string, code: string, name?: string }
// Checks the code against Twilio Verify; on success, upserts the user by
// phone via the phone_login() Postgres function using the service-role
// key (which bypasses RLS/grants — phone_login is intentionally not
// grantable to anon/authenticated, so this Edge Function is the only path
// that can call it). Returns the same shape the old login_user RPC did.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TWILIO_API_KEY_SID = Deno.env.get("TWILIO_API_KEY_SID")!;
const TWILIO_API_KEY_SECRET = Deno.env.get("TWILIO_API_KEY_SECRET")!;
const TWILIO_VERIFY_SERVICE_SID = Deno.env.get("TWILIO_VERIFY_SERVICE_SID")!;

// Auto-injected into every Supabase Edge Function — not set by hand.
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function isValidPhone(phone: unknown): phone is string {
  return typeof phone === "string" && /^\+[1-9]\d{7,14}$/.test(phone);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const { phone, code, name } = await req.json();

    if (!isValidPhone(phone) || typeof code !== "string" || !/^\d{4,10}$/.test(code)) {
      return json({ error: "invalid_input" }, 400);
    }

    const twilioUrl = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`;
    const auth = btoa(`${TWILIO_API_KEY_SID}:${TWILIO_API_KEY_SECRET}`);

    const twilioRes = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: phone, Code: code }),
    });

    if (!twilioRes.ok) {
      const detail = await twilioRes.text();
      console.error("Twilio verify-otp check failed:", twilioRes.status, detail);
      return json({ error: "verify_failed" }, 502);
    }

    const result = await twilioRes.json();
    if (result.status !== "approved") {
      return json({ error: "wrong_code" }, 401);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase
      .rpc("phone_login", { p_phone: phone, p_name: name ?? null })
      .single();

    if (error) {
      console.error("phone_login RPC failed:", error);
      return json({ error: "login_failed" }, 500);
    }

    return json({ user: data });
  } catch (err) {
    console.error("verify-otp error:", err);
    return json({ error: "server_error" }, 500);
  }
});
